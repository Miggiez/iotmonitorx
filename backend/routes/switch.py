from datetime import datetime
from typing import Annotated

from bson import ObjectId
from configurations import devices_col, switch_col
from fastapi import APIRouter, Depends, HTTPException, status
from models.UserModel import LevelEnum, LogEnum, Logs, SwitchButton
from pydantic import BaseModel
from routes.auth import isAuthorized
from routes.logs import post_logs
from schemas.SwitchSchema import switch_individual_serial

switch_router = APIRouter(prefix="/switches", tags=["switches"])


class SwitchButtonEdit(BaseModel):
    state_name: str
    topic: str
    device_id: str


@switch_router.post("/create/{user_id}", status_code=status.HTTP_201_CREATED)
async def create_switch(
    user_id: str, switches: SwitchButton, role: Annotated[str, Depends(isAuthorized)]
):
    device = devices_col.find_one({"_id": ObjectId(switches.device_id)})
    if device is None:
        await post_logs(
            logs=Logs(
                l_type=LogEnum.error,
                description=f"Device with id {switches.device_id} is not found. Failed to create Switch!",
                level=LevelEnum.switch,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device with id {switches.device_id} is not found. Failed to create Switch!",
        )

    switch = SwitchButton(
        switch_name=switches.switch_name,
        topic=switches.topic,
        device_id=switches.device_id,
        updated_at=datetime.now(),
        created_at=datetime.now(),
    )

    id = switch_col.insert_one(dict(switch)).inserted_id
    devices_col.find_one_and_update(
        {"_id": ObjectId(switch.device_id)}, {"$push": {"switches": id}}
    )
    await post_logs(
        logs=Logs(
            l_type=LogEnum.message,
            description=f"Created Switch {switch.switch_name} Successfully!",
            level=LevelEnum.switch,
            user_id=user_id,
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Created Switch {switch.switch_name} Successfully!"}


@switch_router.get("/get/{id}/{user_id}", status_code=status.HTTP_202_ACCEPTED)
async def get_switch(
    id: str, user_id: str, role: Annotated[str, Depends(isAuthorized)]
):
    switch = switch_col.find_one({"_id": ObjectId(id)})
    if switch is None:
        await post_logs(
            logs=Logs(
                l_type=LogEnum.error,
                description=f"Switch with id {id} is not found. Failed to gett Switch!",
                level=LevelEnum.switch,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Switch with id {id} is not found. Failed to get Switch!",
        )

    return switch_individual_serial(switch)


@switch_router.put("/edit/{id}/{user_id}", status_code=status.HTTP_202_ACCEPTED)
async def edit_switch(
    id: str,
    user_id: str,
    switches: SwitchButtonEdit,
    role: Annotated[str, Depends(isAuthorized)],
):
    sw = switch_col.find_one({"_id": ObjectId(id)})
    if sw is None:
        await post_logs(
            logs=Logs(
                l_type=LogEnum.error,
                description=f"Switch with id {id} is not found. Failed to edit Switch!",
                level=LevelEnum.switch,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Switch with id {id} is not found. Failed to edit Switch!",
        )

    switch = SwitchButton(
        switch_name=switches.switch_name,
        topic=switches.topic,
        device_id=sw["device_id"],
        updated_at=datetime.now(),
        created_at=sw["device_id"],
    )
    switch_col.update_one({"_id": ObjectId(id)}, {"$set": dict(switch)})
    await post_logs(
        logs=Logs(
            l_type=LogEnum.message,
            description=f"Successfully edited Switch {id}",
            level=LevelEnum.switch,
            user_id=user_id,
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Successfully edited Switch {id}"}


@switch_router.delete("/delete/{id}/{user_id}", status_code=status.HTTP_200_OK)
async def delete_switch(
    id: str, user_id: str, role: Annotated[str, Depends(isAuthorized)]
):
    switch = switch_col.find_one({"_id": ObjectId(id)})
    if switch is None:
        await post_logs(
            logs=Logs(
                l_type=LogEnum.error,
                description=f"Switch with id {id} is not found. Failed to delete Switch!",
                level=LevelEnum.switch,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Switch with id: {id} is not found",
        )
    devices_col.update_one(
        {"_id": ObjectId(switch["device_id"])},
        {"$pull": {"switches": ObjectId(id)}},
    )
    switch_col.find_one_and_delete({"_id": ObjectId(id)})
    await post_logs(
        logs=Logs(
            l_type=LogEnum.message,
            description=f"Successfully deleted Switch {id}",
            level=LevelEnum.switch,
            user_id=user_id,
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Successfully deleted Switch {id}"}
