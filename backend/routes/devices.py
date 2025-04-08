from datetime import datetime

from bson import ObjectId
from configurations import chart_col, devices_col
from fastapi import APIRouter, HTTPException, status
from models.UserModel import Devices
from schemas.ChartSchema import chart_list_serial
from schemas.DeviceSchema import delete_charts_array, delete_gauges_array

device_router = APIRouter(prefix="/devices", tags=["devices"])


@device_router.post("/create/device", status_code=status.HTTP_201_CREATED)
async def post_device(devices: Devices):
    device = Devices(
        device_name=devices.device_name,
        charts=[],
        gauges=[],
        project_id=devices.project_id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    devices_col.insert_one(dict(device))
    return {"message": f"Created Device {device.device_name}  Successfully!"}


@device_router.put("/edit/{id}", status_code=status.HTTP_200_OK)
async def edit_device(id: str, devices: Devices):
    dev = devices_col.find_one({"_id": ObjectId(id)})
    if dev is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device with id {id} is not Found!",
        )
    device = Devices(
        device_name=devices.device_name,
        charts=dev["charts"],
        gauges=dev["gauges"],
        project_id=devices.project_id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    devices_col.update_one({"_id": ObjectId(id)}, {"$set": dict(device)})
    return {"message": f"Successfully edited {id}"}


@device_router.delete("/delete/{id}", status_code=status.HTTP_200_OK)
async def delete_device(id: str):
    device = devices_col.find_one({"_id": ObjectId(id)})
    if device is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You cannot delete Device id: {id}, because this does not exist",
        )
    delete_charts_array(device["charts"])
    delete_gauges_array(device["gauges"])
    devices_col.delete_one({"_id": ObjectId(id)})
    return {"message": f"Successfully deleted {id}"}


@device_router.get("{id}/getall/charts", status_code=status.HTTP_200_OK)
async def get_all_charts(id: str):
    device = devices_col.find_one({"_id": ObjectId(id)})
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device with id {id} does not exist!",
        )
    device_charts = chart_list_serial(
        chart_col.find({"_id": {"$in": device["charts"]}})
    )
    return device_charts
