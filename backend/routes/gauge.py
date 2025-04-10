from datetime import datetime

from bson import ObjectId
from configurations import devices_col, gauge_col
from fastapi import APIRouter, HTTPException, status
from models.UserModel import GaugeMeasurements

gauge_router = APIRouter(prefix="/gauges", tags=["gauges"])


@gauge_router.post("/gauge/create", status_code=status.HTTP_201_CREATED)
async def create_chart(gauges: GaugeMeasurements):
    device = devices_col.find_one({"_id": ObjectId(gauges.device_id)})
    if device is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device with id {gauges.device_id} is not found. You cannot proceed creating a chart without a device",
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
        {"_id": ObjectId(gauge.device_id)}, {"$push": {"gauges": ObjectId(id)}}
    )
    return {"message": f"Created Gauge {gauge.title} Successfully!"}


@gauge_router.put("/gauge/edit/{id}", status_code=status.HTTP_202_ACCEPTED)
async def edit_chart(id: str, gauges: GaugeMeasurements):
    ga = gauge_col.find_one({"_id": ObjectId(id)})
    if ga is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chart with id: {id} is not found",
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
    return {"message": f"Successfully edited Chart {id}"}


@gauge_router.delete("/gauge/delete/{id}", status_code=status.HTTP_200_OK)
async def delete_chart(id: str):
    gauge = gauge_col.find_one({"_id": ObjectId(id)})
    if gauge is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"gauge with id: {id} is not found",
        )
    devices_col.update_one(
        {"_id": ObjectId(gauge["device_id"])},
        {"$pull": {"gauges": ObjectId(id)}},
    )
    gauge_col.find_one_and_delete({"_id": ObjectId(id)})
    return {"message": f"Successfully deleted Gauge {id} {gauge['title']}"}
