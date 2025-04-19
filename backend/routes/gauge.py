from datetime import datetime

from bson import ObjectId
from configurations import devices_col, gauge_col
from fastapi import APIRouter, HTTPException, status
from models.UserModel import GaugeMeasurements, LevelEnum, LogEnum, Logs
from routes.logs import post_logs
from schemas.GaugeSchema import gauge_individual_serial

gauge_router = APIRouter(prefix="/gauges", tags=["gauges"])


@gauge_router.post("/create/{user_id}", status_code=status.HTTP_201_CREATED)
async def create_gauge(user_id: str, gauges: GaugeMeasurements):
    device = devices_col.find_one({"_id": ObjectId(gauges.device_id)})
    if device is None:
        await post_logs(
            logs=Logs(
                l_type=LogEnum.error,
                description=f"Device with id {gauges.device_id} is not found. Failed to create Gauge!",
                level=LevelEnum.gauge,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device with id {gauges.device_id} is not found. Failed to create Gauge!",
        )

    gauge = GaugeMeasurements(
        topic=gauges.topic,
        title=gauges.title,
        max_value=gauges.max_value,
        min_value=gauges.min_value,
        m_type=gauges.m_type,
        unit=gauges.unit,
        device_id=gauges.device_id,
        updated_at=datetime.now(),
        created_at=datetime.now(),
    )

    id = gauge_col.insert_one(dict(gauge)).inserted_id
    devices_col.find_one_and_update(
        {"_id": ObjectId(gauge.device_id)}, {"$push": {"gauges": id}}
    )
    await post_logs(
        logs=Logs(
            l_type=LogEnum.message,
            description=f"Created Chart {gauge.title} Successfully!",
            level=LevelEnum.gauge,
            user_id=user_id,
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Created Gauge {gauge.title} Successfully!"}


@gauge_router.get("/get/{id}/{user_id}", status_code=status.HTTP_202_ACCEPTED)
async def get_gauge(id: str, user_id: str):
    gauge = gauge_col.find_one({"_id": ObjectId(id)})
    if gauge is None:
        await post_logs(
            logs=Logs(
                l_type=LogEnum.error,
                description=f"Gauge with id {id} is not found. Failed to get Gauge!",
                level=LevelEnum.gauge,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Gauge with id {id} is not found. Failed to get Gauge!",
        )

    return gauge_individual_serial(gauge)


@gauge_router.put("/edit/{id}/{user_id}", status_code=status.HTTP_202_ACCEPTED)
async def edit_gauge(id: str, user_id: str, gauges: GaugeMeasurements):
    ga = gauge_col.find_one({"_id": ObjectId(id)})
    if ga is None:
        await post_logs(
            logs=Logs(
                l_type=LogEnum.error,
                description=f"Gauge with id {id} is not found. Failed to edit Gauge!",
                level=LevelEnum.gauge,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Gauge with id {id} is not found. Failed to edit Gauge!",
        )

    gauge = GaugeMeasurements(
        topic=gauges.topic,
        title=gauges.title,
        max_value=gauges.max_value,
        min_value=gauges.min_value,
        m_type=gauges.m_type,
        unit=gauges.unit,
        device_id=ga["device_id"],
        updated_at=datetime.now(),
        created_at=ga["device_id"],
    )
    gauge_col.update_one({"_id": ObjectId(id)}, {"$set": dict(gauge)})
    await post_logs(
        logs=Logs(
            l_type=LogEnum.message,
            description=f"Successfully edited Gauge {id}",
            level=LevelEnum.gauge,
            user_id=user_id,
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Successfully edited Gauge {id}"}


@gauge_router.delete("/delete/{id}/{user_id}", status_code=status.HTTP_200_OK)
async def delete_gauge(id: str, user_id: str):
    gauge = gauge_col.find_one({"_id": ObjectId(id)})
    if gauge is None:
        await post_logs(
            logs=Logs(
                l_type=LogEnum.error,
                description=f"Gauge with id {id} is not found. Failed to delete Gauge!",
                level=LevelEnum.gauge,
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Gauge with id {id} is not found. Failed to delete Gauge!",
        )
    devices_col.update_one(
        {"_id": ObjectId(gauge["device_id"])},
        {"$pull": {"gauges": ObjectId(id)}},
    )
    gauge_col.find_one_and_delete({"_id": ObjectId(id)})
    await post_logs(
        logs=Logs(
            l_type=LogEnum.message,
            description=f"Successfully deleted Gauge {id}",
            level=LevelEnum.gauge,
            user_id=user_id,
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Successfully deleted Gauge {id}"}
