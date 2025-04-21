from datetime import datetime
import json

from bson import ObjectId
from configurations import influx_connection, logs_col, user_col
from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from models.UserModel import User
from passlib.context import CryptContext
from schemas.LogSchema import log_list_serial
from schemas.UserSchema import (
    delete_projects_array,
    get_project_device,
    user_individual_serial,
    user_list_serial,
)

user_router = APIRouter(prefix="/user", tags=["user"])
SECRET_KEY = "your_super_secret_key_here"
ALGORITHM = "HS256"
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/login")




@user_router.get("/get/user/{user_id}", status_code=status.HTTP_200_OK)
async def find_user_by_id(user_id: str):
    user = user_col.find_one({"_id": ObjectId(user_id)})
    if user:
        return user_individual_serial(user)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

@user_router.get("/{id}/getall/logs", status_code=status.HTTP_200_OK)
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


@user_router.get("/{id}/getall/projects", status_code=status.HTTP_200_OK)
async def get_projects(id: str):
    user = user_col.find_one({"_id": ObjectId(id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {id} does not exist!",
        )
    # projects = project_list_serial(project_col.find({"_id": {"$in": user["project"]}}))
    Proj_string_list = [json.dumps(obj, default=str) for obj in user["project"]]

   
    projects = get_project_device(Proj_string_list)
    return projects

