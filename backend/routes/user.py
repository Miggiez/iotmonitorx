from datetime import datetime

from bson import ObjectId
from configurations import project_col, user_col
from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from models.UserModel import RoleEnum, User
from passlib.context import CryptContext
from schemas.UserSchema import user_individual_serial, user_list_serial

user_router = APIRouter(prefix="/user", tags=["user"])
SECRET_KEY = "your_super_secret_key_here"
ALGORITHM = "HS256"
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/login")


@user_router.post("/create/user", status_code=status.HTTP_201_CREATED)
def register_user(user: User):
    # Check if the username already exists
    if user_col.find_one({"username": user.username}):
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
    user_col.insert_one(dict(db_user))
    return {"message": "User created successfully", "user": db_user.username}


@user_router.get("/get/users")
async def find_all_users():
    return user_list_serial(user_col.find())


@user_router.get("/get/user/{user_id}")
async def find_user_by_id(user_id: str):
    user = user_col.find_one({"_id": ObjectId(user_id)})
    if user:
        return user_individual_serial(user)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )


@user_router.get("/get/usersby/{role}")
async def find_users_by_roleId(role: RoleEnum):
    users = user_col.find({"role": role})
    if users:
        return user_list_serial(users)
    else:
        return {"message": "Users with this role is empty"}


@user_router.put("/update/user/{user_id}")
async def update_user(user_id: str, user: User):
    # Check if the user exists
    existing_user = user_col.users.find_one({"_id": ObjectId(user_id)})
    if not existing_user:
        return {"error": "User not found"}
    hashed_password = bcrypt_context.hash(user.password)
    user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        project=user.project,
        logs=user.logs,
        role=user.role,
        created_at=existing_user["created_at"],
        updated_at=datetime.now(),
    )
    # Update the user in the database
    user_col.users.find_one_and_update(
        {"_id": ObjectId(user_id)},  # Query by ObjectId
        {"$set": dict(user)},  # Update with the fields in the User object
    )
    updated_user = user_col.users.find_one({"_id": ObjectId(user_id)})
    if updated_user:
        return user_individual_serial(updated_user)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to update user"
        )


@user_router.delete("/delete/user/{user_id}")
async def delete_user(user_id: str):
    user = user_col.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found!"
        )
    user_col.delete_one({"_id": ObjectId(user_id)})
    project_col.delete_many({"_id": {"$in": user["project"]}})
    return {"message": f"User with id: {user_id} is successfully deleted!"}
