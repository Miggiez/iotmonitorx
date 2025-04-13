from datetime import datetime

from bson import ObjectId
from configurations import (
    chart_col,
    devices_col,
    fast_mq,
    influx_connection,
    project_col,
    user_col,
)
from fastapi import APIRouter, HTTPException, status
from models.UserModel import Devices
from pydantic import BaseModel
from schemas.ChartSchema import chart_list_serial
from schemas.DeviceSchema import delete_charts_array, delete_gauges_array

device_router = APIRouter(prefix="/devices", tags=["devices"])


class Publisher(BaseModel):
    user_id: str
    device_id: str
    name: str
    state: bool


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
    id = devices_col.insert_one(dict(device)).inserted_id
    project_col.find_one_and_update(
        {"_id": ObjectId(device.project_id)}, {"$push": {"devices": ObjectId(id)}}
    )
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
    project_col.update_one(
        {"_id": ObjectId(device["project_id"])},
        {"$pull": {"devices": ObjectId(id)}},
    )
    delete_charts_array(device["charts"])
    delete_gauges_array(device["gauges"])
    devices_col.delete_one({"_id": ObjectId(id)})
    return {"message": f"Successfully deleted {id}"}


@device_router.get("/{id}/getall/charts", status_code=status.HTTP_200_OK)
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


@device_router.get("/{user_id}/{id}/getall/fields", status_code=status.HTTP_200_OK)
async def get_all_fields(id: str, user_id: str):
    device = devices_col.find_one({"_id": ObjectId(id)})
    user = user_col.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with id {user_id} does not exist!",
        )
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device with id {id} does not exist!",
        )
    influx = influx_connection()
    influx.switch_database(user_id)
    measurements = list(
        *influx.query(f'select * from "{id}" group by * order by desc limit 1;')
    )
    fields = measurements[0]
    field_list = [*fields.keys()]
    field_list.pop(0)
    return field_list


@device_router.get("/{user_id}/{id}/chart/{field}/{time}")
async def get_chart_value(user_id: str, id: str, field: str, time: str):
    device = devices_col.find_one({"_id": ObjectId(id)})
    user = user_col.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with id {user_id} does not exist!",
        )
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device with id {id} does not exist!",
        )
    influx = influx_connection()
    influx.switch_database(user_id)
    charts = list(
        *influx.query(
            f'select "{field}" from "{id}" where time > now() - {time} and "{field}" != -1'
        )
    )
    return charts


@device_router.get("/{user_id}/{id}/gauge/{field}")
async def get_gauge_value(user_id: str, id: str, field: str):
    device = devices_col.find_one({"_id": ObjectId(id)})
    user = user_col.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with id {user_id} does not exist!",
        )
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device with id {id} does not exist!",
        )
    influx = influx_connection()
    influx.switch_database(user_id)
    gauge = list(
        *influx.query(
            f'select "{field}" from "{id}" where "{field}" != 1 group by * order by desc limit 1'
        )
    )
    return gauge


@device_router.post("/button/press")
async def create_publish(topic: Publisher):
    user_id = topic.user_id
    device_id = topic.device_id
    name = topic.name
    state = topic.state
    fast_mq.publish(f"/{user_id}/{device_id}/{name}", payload={f"{name}": state})
    return {"message": "Successfully published a topic"}
