from configurations import user_col
from fastapi import APIRouter
from models.UserModel import User
from schemas.UserSchema import list_serial

router = APIRouter()


@router.get("/")
async def get_users():
    users = list_serial(user_col.find())
    return users


@router.post("/")
async def post_users(user: User):
    user_col.insert_one(dict(user))
    return {"message": "Created User Successfully!"}
