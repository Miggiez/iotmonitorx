from datetime import datetime

from bson import ObjectId
from configurations import logs_col, user_col
from fastapi import APIRouter, HTTPException, status
from models.UserModel import Logs

log_router = APIRouter(prefix="/logs", tags=["logs"])


@log_router.post("/create/log", status_code=status.HTTP_201_CREATED)
async def post_logs(logs: Logs):
    user = user_col.find_one({"_id": ObjectId(logs.user_id)})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {logs.user_id} does not exist",
        )
    log = Logs(
        title=logs.title,
        l_type=logs.l_type,
        description=logs.description,
        level=logs.level,
        user_id=logs.user_id,
        updated_at=datetime.now(),
        created_at=datetime.now(),
    )
    id = logs_col.insert_one(dict(log)).inserted_id
    user_col.update_one(
        {"_id": ObjectId(logs["user_id"])}, {"$push": {"logs": ObjectId(id)}}
    )

    return {"message": f"Created Log {log.title} Successfully!"}


@log_router.put("/edit/{id}", status_code=status.HTTP_202_ACCEPTED)
async def edit_log(id: str, logs: Logs):
    log = logs_col.find_one({"_id": ObjectId(id)})
    if log is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log with id {id} is not Found!",
        )
    log_single = Logs(
        title=logs.title,
        l_type=logs.l_type,
        description=logs.description,
        level=logs.level,
        user_id=logs.user_id,
        updated_at=datetime.now(),
        created_at=log["created_at"],
    )
    logs_col.update_one({"_id": ObjectId(id)}, {"$set": dict(log_single)})
    return {"message": f"Successfully edited Log {id}"}


@log_router.delete("/delete/{id}", status_code=status.HTTP_202_ACCEPTED)
async def delete_log(id: str):
    log = logs_col.find_one({"_id": ObjectId(id)})
    if log is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You cannot delete Log id: {id}, because this does not exist",
        )
    logs_col.delete_one({"_id": ObjectId(id)})
    user_col.delete_one(
        {"_id": ObjectId(log["user_id"])}, {"$pull": {"logs": ObjectId(id)}}
    )
    return {"message": f"Successfully deleted log: {id}"}
