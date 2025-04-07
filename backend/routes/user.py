from configurations import user_col
from fastapi import APIRouter
from models.UserModel import User
from schemas.UserSchema import list_serial

user_router = APIRouter(prefix="/users", tags=["users"])


@user_router.get("/getall")
async def get_users():
    users = list_serial(user_col.find())
    return users


@user_router.post("/create/user")
async def post_users(user: User):
    user_col.insert_one(dict(user))
    return {"message": "Created User Successfully!"}
