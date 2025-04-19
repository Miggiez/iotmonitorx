from datetime import datetime

from bson import ObjectId
from configurations import devices_col, switch_col
from fastapi import APIRouter, HTTPException, status
from models.UserModel import SwitchButton
from pydantic import BaseModel
from schemas.SwitchSchema import switch_individual_serial

switch_router = APIRouter(prefix="/switches", tags=["switches"])


class SwitchButtonEdit(BaseModel):
    state_name: str
    topic: str
    device_id: str


@switch_router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_switch(switches: SwitchButton):
    device = devices_col.find_one({"_id": ObjectId(switches.device_id)})
    if device is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device with id {switches.device_id} is not found. You cannot proceed creating a switch without a device",
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
    return {"message": f"Created Switch {switch.switch_name} Successfully!"}


@switch_router.get("/get/{id}", status_code=status.HTTP_202_ACCEPTED)
async def get_switch(id: str):
    switch = switch_col.find_one({"_id": ObjectId(id)})
    if switch is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Switch with id: {id} is not found",
        )

    return switch_individual_serial(switch)


@switch_router.put("/edit/{id}", status_code=status.HTTP_202_ACCEPTED)
async def edit_switch(id: str, switches: SwitchButtonEdit):
    sw = switch_col.find_one({"_id": ObjectId(id)})
    if sw is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Switch with id: {id} is not found",
        )

    switch = SwitchButton(
        switch_name=switches.switch_name,
        topic=switches.topic,
        device_id=sw["device_id"],
        updated_at=datetime.now(),
        created_at=sw["device_id"],
    )
    switch_col.update_one({"_id": ObjectId(id)}, {"$set": dict(switch)})
    return {"message": f"Successfully edited Switch {id}"}


@switch_router.delete("/delete/{id}", status_code=status.HTTP_200_OK)
async def delete_switch(id: str):
    switch = switch_col.find_one({"_id": ObjectId(id)})
    if switch is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Switch with id: {id} is not found",
        )
    devices_col.update_one(
        {"_id": ObjectId(switch["device_id"])},
        {"$pull": {"switches": ObjectId(id)}},
    )
    switch_col.find_one_and_delete({"_id": ObjectId(id)})
    return {"message": f"Successfully deleted Switch {id} {switch['switch_name']}"}
