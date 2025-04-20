from datetime import datetime

from bson import ObjectId
from configurations import influx_connection, logs_col, user_col
from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from models.UserModel import User
from passlib.context import CryptContext
from schemas.LogSchema import log_list_serial
import configurations as conf
from schemas.UserSchema import (
    delete_projects_array,
    get_project_device,
    user_individual_serial,
    user_list_serial,
)

admin_user_router = APIRouter(prefix="/user", tags=["admin user"])
SECRET_KEY = "your_super_secret_key_here"
ALGORITHM = "HS256"
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/login")


@admin_user_router.post("/create/user", status_code=status.HTTP_201_CREATED)
async def register_user(user: User):
    # Check if the username already exists
    original_user = user_col.find_one({"email": user.email})
    if original_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User exists!"
        )

    # Hash the password
    hashed_password = bcrypt_context.hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        project=[],
        logs=[],
        role=user.role,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )  # Added email field
    # Store the user in the database
    result =user_col.insert_one(dict(db_user))
    print(result.inserted_id)
    create_influx_database(str(result.inserted_id))
    return {"message": "User created successfully", "user": db_user.username}


@admin_user_router.get("/get/users", status_code=status.HTTP_200_OK)
async def find_all_users():
    return user_list_serial(user_col.find())


@admin_user_router.get("/get/user/{user_id}", status_code=status.HTTP_200_OK)
async def find_user_by_id(user_id: str):
    user = user_col.find_one({"_id": ObjectId(user_id)})
    if user:
        return user_individual_serial(user)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )


@admin_user_router.put("/update/user/{user_id}", status_code=status.HTTP_202_ACCEPTED)
async def update_user(user_id: str, user: User):
    # Check if the user exists
    existing_user = user_col.find_one({"_id": ObjectId(user_id)})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} does not exist",
        )
    
    # Ensure project and logs exist, initialize as empty lists if not
    project = existing_user.get("project", [])
    logs = existing_user.get("logs", [])
    
    hashed_password = bcrypt_context.hash(user.password)
    user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        project=project,
        logs=logs,
        created_at=existing_user["created_at"],
        role=user.role,
        updated_at=datetime.now(),
    )
    
    # Update the user in the database (removed .users from user_col)
    user_col.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": dict(user)},
    )
    
    updated_user = user_col.find_one({"_id": ObjectId(user_id)})
    if updated_user:
        return user_individual_serial(updated_user)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to update user"
        )


@admin_user_router.delete("/delete/user/{user_id}", status_code=status.HTTP_202_ACCEPTED)
async def delete_user(user_id: str):
    influx = influx_connection()
    user = user_col.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found!"
        )
    influx.drop_database(user_id)
    project = user.get("project", [])
    logs = user.get("logs", [])
    await delete_projects_array(project)
    logs_col.delete_many({"_id": {"$in": logs}})
    user_col.delete_one({"_id": ObjectId(user_id)})
    return {"message": f"User with id: {user_id} is successfully deleted!"}


@admin_user_router.get("/{id}/getall/logs", status_code=status.HTTP_200_OK)
async def get_all_logs(id: str):
    user = user_col.find_one({"_id": ObjectId(id)})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {id} does not exist",
        )
    logs = log_list_serial(logs_col.find({"_id": {"$in": ObjectId(user["logs"])}}))
    print(logs)
    return logs


@admin_user_router.get("/{id}/getall/projects", status_code=status.HTTP_200_OK)
async def get_projects(id: str):
    user = user_col.find_one({"_id": ObjectId(id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {id} does not exist!",
        )
    # projects = project_list_serial(project_col.find({"_id": {"$in": user["project"]}}))
    projects = get_project_device(user["project"])
    return projects

def create_influx_database(user_id: str):
    influx = conf.influx
    influx.create_database(user_id)
    influx.create_retention_policy(
        name=user_id,
        database=user_id,
        duration="30d",
        replication=1,
        default=True,
    )
    return {"message": f"Influx database for user {user_id} created successfully!"}
     
