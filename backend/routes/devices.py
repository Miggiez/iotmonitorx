from datetime import datetime

from bson import ObjectId
from configurations import (
    chart_col,
    devices_col,
    fast_mq,
    gauge_col,
    influx_connection,
    project_col,
    switch_col,
    user_col,
)
from fastapi import APIRouter, HTTPException, status
from models.UserModel import Devices, LevelEnum, LogEnum, Logs
from pydantic import BaseModel
from routes.logs import post_logs
from schemas.ChartSchema import chart_list_serial
from schemas.DeviceSchema import (
    delete_charts_array,
    delete_gauges_array,
    device_individual_serial,
)
from schemas.GaugeSchema import gauge_list_serial
from schemas.SwitchSchema import switch_list_serial

device_router = APIRouter(prefix="/devices", tags=["devices"])


class Publisher(BaseModel):
    user_id: str
    device_id: str
    name: str
    state: bool


class DeviceUpdate(BaseModel):
    device_name: str


@device_router.post("/create/{user_id}", status_code=status.HTTP_201_CREATED)
async def post_device(user_id: str, devices: Devices):
    project = project_col.find_one({"_id": ObjectId(devices.project_id)})
    if not project:
        await post_logs(
            logs=Logs(
                t_type=LogEnum.error,
                description=f"Project with id {devices.project_id} is not found. Failed to create Device!",
                level=LevelEnum.device,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {devices.project_id} is not found. You cannot proceed creating a chart without a device",
        )

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
        {"_id": ObjectId(device.project_id)}, {"$push": {"devices": id}}
    )
    await post_logs(
        logs=Logs(
            l_type=LogEnum.message,
            description=f"Created Device {device.device_name}  Successfully!",
            level=LevelEnum.device,
            user_id=project["user_id"],
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {
        "message": f"Created Device {device.device_name}  Successfully!",
        "id": str(id),
    }


@device_router.get("/get/{id}/{user_id}", status_code=status.HTTP_201_CREATED)
async def get_device(id: str, user_id: str):
    print(id)
    device = devices_col.find_one({"_id": ObjectId(id)})
    if not device:
        await post_logs(
            logs=Logs(
                t_type=LogEnum.error,
                description=f"Device with this id: {id} is not found. Failed to get Device!",
                level=LevelEnum.device,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device with this id: {id} is not found. Failed to get Device!",
        )

    return device_individual_serial(device)


@device_router.put("/edit/{id}/{user_id}", status_code=status.HTTP_200_OK)
async def edit_device(id: str, user_id: str, devices: DeviceUpdate):
    dev = devices_col.find_one({"_id": ObjectId(id)})
    if dev is None:
        await post_logs(
            logs=Logs(
                t_type=LogEnum.error,
                description=f"Device with this id: {id} is not found. Failed to edit Device!",
                level=LevelEnum.device,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device with this id: {id} is not found. Failed to edit Device!",
        )
    device = Devices(
        device_name=devices.device_name,
        charts=dev["charts"],
        gauges=dev["gauges"],
        project_id=dev["project_id"],
        created_at=dev["created_at"],
        updated_at=datetime.now(),
    )
    devices_col.update_one({"_id": ObjectId(id)}, {"$set": dict(device)})
    await post_logs(
        logs=Logs(
            t_type=LogEnum.message,
            description=f"Successfully edited Device {id}",
            level=LevelEnum.device,
            user_id=user_id,
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Successfully edited Device {id}"}


@device_router.delete("/delete/{id}/{user_id}", status_code=status.HTTP_200_OK)
async def delete_device(id: str, user_id: str):
    influx = influx_connection()
    device = devices_col.find_one({"_id": ObjectId(id)})
    if device is None:
        await post_logs(
            logs=Logs(
                t_type=LogEnum.error,
                description=f"Device with this id: {id} is not found. Failed to delete Device!",
                level=LevelEnum.device,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device with this id: {id} is not found. Failed to delete Device!",
        )
    project_col.update_one(
        {"_id": ObjectId(device["project_id"])},
        {"$pull": {"devices": ObjectId(id)}},
    )
    influx.switch_database(user_id)
    influx.drop_measurement(id)
    await delete_charts_array(device["charts"])
    await delete_gauges_array(device["gauges"])
    devices_col.delete_one({"_id": ObjectId(id)})
    await post_logs(
        logs=Logs(
            l_type=LogEnum.message,
            description=f"Successfully deleted Device {id}",
            level=LevelEnum.device,
            user_id=user_id,
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Successfully deleted Device {id}"}


@device_router.get("/{id}/getall/charts/{user_id}", status_code=status.HTTP_200_OK)
async def get_all_charts(id: str, user_id: str):
    device = devices_col.find_one({"_id": ObjectId(id)})
    if not device:
        await post_logs(
            logs=Logs(
                t_type=LogEnum.error,
                description=f"Device with this id: {id} is not found. Failed to get all Charts!",
                level=LevelEnum.device,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device with this id: {id} is not found. Failed to get all Charts!",
        )
    device_charts = chart_list_serial(
        chart_col.find({"_id": {"$in": device["charts"]}})
    )
    return device_charts


@device_router.get("/{id}/getall/gauges/{user_id}", status_code=status.HTTP_200_OK)
async def get_all_gauges(id: str, user_id: str):
    device = devices_col.find_one({"_id": ObjectId(id)})
    if not device:
        await post_logs(
            logs=Logs(
                t_type=LogEnum.error,
                description=f"Device with this id: {id} is not found. Failed to get all Gauges!",
                level=LevelEnum.device,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device with this id: {id} is not found. Failed to get all Gauges!",
        )
    device_gauges = gauge_list_serial(
        gauge_col.find({"_id": {"$in": device["gauges"]}})
    )
    return device_gauges


@device_router.get("/{id}/getall/switches/{user_id}", status_code=status.HTTP_200_OK)
async def get_all_switches(id: str, user_id: str):
    device = devices_col.find_one({"_id": ObjectId(id)})
    if not device:
        await post_logs(
            logs=Logs(
                t_type=LogEnum.error,
                description=f"Device with this id: {id} is not found. Failed to get all Switch!",
                level=LevelEnum.device,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device with this id: {id} is not found. Failed to get all Switch!",
        )
    device_switches = switch_list_serial(
        switch_col.find({"_id": {"$in": device["switches"]}})
    )
    return device_switches


@device_router.get("/{user_id}/{id}/getall/fields", status_code=status.HTTP_200_OK)
async def get_all_fields(id: str, user_id: str):
    device = devices_col.find_one({"_id": ObjectId(id)})
    user = user_col.find_one({"_id": ObjectId(user_id)})
    if not user:
        await post_logs(
            logs=Logs(
                t_type=LogEnum.error,
                description=f"User with this id: {id} is not found. Failed to get all Fields!",
                level=LevelEnum.device,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with this id: {id} is not found. Failed to get all Fields!",
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
    if measurements:
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
            f'select "{field}" from "{id}" where time < now() - {time} and "{field}" != 1'
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


@device_router.get("/{user_id}/{id}/switch/{field}")
async def get_switch_value(user_id: str, id: str, field: str):
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
    switch = list(
        *influx.query(f'select "{field}" from "{id}" group by * order by desc limit 1')
    )
    return switch


@device_router.post("/button/press")
async def create_publish(topic: Publisher):
    user_id = topic.user_id
    device_id = topic.device_id
    name = topic.name
    state = topic.state
    fast_mq.publish(f"/{user_id}/{device_id}/{name}", payload={f"{name}": state})
    return {"message": "Successfully published a topic"}
