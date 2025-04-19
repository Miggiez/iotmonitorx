from datetime import datetime

from bson import ObjectId
from configurations import chart_col, devices_col
from fastapi import APIRouter, HTTPException, status
from logs import post_logs
from models.UserModel import ChartMeasurement, Logs
from pydantic import BaseModel
from schemas.ChartSchema import chart_individual_serial

chart_router = APIRouter(prefix="/charts", tags=["charts"])


class ChartMeasurementEdit(BaseModel):
    title: str
    topic: str
    name: str
    color: str


@chart_router.post("/create/{user_id}", status_code=status.HTTP_201_CREATED)
async def create_chart(user_id: str, charts: ChartMeasurement):
    device = devices_col.find_one({"_id": ObjectId(charts.device_id)})
    if device is None:
        await post_logs(
            logs=Logs(
                l_type="error",
                description=f"Device with id {charts.device_id} is not found. Failed to create Chart!",
                level="chart",
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device with id {charts.device_id} is not found. Failed to create Chart!",
        )

    chart = ChartMeasurement(
        title=charts.title,
        topic=charts.topic,
        name=charts.name,
        color=charts.color,
        device_id=charts.device_id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )

    id = chart_col.insert_one(dict(chart)).inserted_id
    devices_col.find_one_and_update(
        {"_id": ObjectId(chart.device_id)}, {"$push": {"charts": id}}
    )

    await post_logs(
        logs=Logs(
            l_type="message",
            description=f"Created Chart {chart.title} Successfully!",
            level="chart",
            user_id=user_id,
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Created Chart {chart.title} Successfully!"}


@chart_router.get("/get/{id}/{user_id}", status_code=status.HTTP_200_OK)
async def get_single_chart(id: str, user_id: str):
    chart = chart_col.find_one({"_id": ObjectId(id)})
    if chart is None:
        await post_logs(
            logs=Logs(
                l_type="error",
                description=f"Chart with id: {id} is not found. Failed to get Chart!",
                level="chart",
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chart with id: {id} is not found",
        )
    return chart_individual_serial(chart)


@chart_router.put("/edit/{id}/{user_id}", status_code=status.HTTP_202_ACCEPTED)
async def edit_chart(id: str, user_id: str, charts: ChartMeasurementEdit):
    ch = chart_col.find_one({"_id": ObjectId(id)})
    if ch is None:
        await post_logs(
            logs=Logs(
                l_type="error",
                description=f"Chart with id: {id} is not found. Failed to edit Chart!",
                level="chart",
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chart with id: {id} is not found. Failed to edit Chart",
        )

    chart = ChartMeasurement(
        title=charts.title,
        topic=charts.topic,
        name=charts.name,
        color=charts.color,
        device_id=ch["device_id"],
        created_at=ch["created_at"],
        updated_at=datetime.now(),
    )
    chart_col.update_one({"_id": ObjectId(id)}, {"$set": dict(chart)})
    await post_logs(
        logs=Logs(
            l_type="message",
            description=f"Successfully edited Chart {id}!",
            level="chart",
            user_id=user_id,
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Successfully edited Chart {id}!"}


@chart_router.delete("/delete/{id}/{user_id}", status_code=status.HTTP_200_OK)
async def delete_chart(id: str, user_id: str):
    chart = chart_col.find_one({"_id": ObjectId(id)})
    if chart is None:
        await post_logs(
            logs=Logs(
                l_type="error",
                description=f"Chart with id: {id} is not found. Failed to delete Chart!",
                level="chart",
                user_id=user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chart with id: {id} is not found. Failed to delete Chart!",
        )
    devices_col.update_one(
        {"_id": ObjectId(chart["device_id"])},
        {"$pull": {"charts": ObjectId(id)}},
    )
    chart_col.find_one_and_delete({"_id": ObjectId(id)})
    await post_logs(
        logs=Logs(
            l_type="message",
            description=f"Successfully deleted Chart {id} {chart['title']}",
            level="chart",
            user_id=user_id,
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Successfully deleted Chart {id} {chart['title']}"}
