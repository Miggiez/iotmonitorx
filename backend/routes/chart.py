from bson import ObjectId
from configurations import chart_col, devices_col
from fastapi import APIRouter, HTTPException, status
from models.UserModel import ChartMeasurement

chart_router = APIRouter(prefix="/charts", tags=["charts"])


@chart_router.post("/chart/create", status_code=status.HTTP_201_CREATED)
async def create_chart(chart: ChartMeasurement):
    device = devices_col.find_one({"_id": ObjectId(chart.device_id)})
    if device is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device with id {chart.device_id} is not found. You cannot proceed creating a chart without a device",
        )
    id = chart_col.insert_one(dict(chart)).inserted_id
    devices_col.find_one_and_update(
        {"_id": ObjectId(chart.device_id)}, {"$push": {"charts": ObjectId(id)}}
    )
    return {"message": f"Created Chart {chart.title} Successfully!"}


@chart_router.put("/charts/edit/{id}", status_code=status.HTTP_202_ACCEPTED)
async def edit_chart(id: str, chart: ChartMeasurement):
    chart = chart_col.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(chart)})
    if chart is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chart with id: {id} is not found",
        )
    return {"message": f"Successfully edited {id}"}


@chart_router.delete("/charts/delete/{id}", status_code=status.HTTP_200_OK)
async def delete_chart(id: str):
    chart = chart_col.find_one({"_id": ObjectId(id)})
    if chart is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chart with id: {id} is not found",
        )
    devices_col.update_one(
        {"_id": ObjectId(chart["device_id"])},
        {"$pull": {"charts": ObjectId(id)}},
    )
    chart_col.find_one_and_delete({"_id": ObjectId(id)})
    return {"message": f"Successfully deleted {id} {chart['title']}"}
