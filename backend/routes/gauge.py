from configurations import gauge_col
from fastapi import APIRouter
from models.UserModel import GaugeMeasurements
from schemas.GaugeSchema import gauge_list_serial

gauge_router = APIRouter(prefix="/gauges", tags=["gauges"])


@gauge_router.get("gauge/getall")
async def get_all_gauge():
    gauges = gauge_list_serial(gauge_col.find())
    return gauges


@gauge_router.post("/gauge/create")
async def create_gauge(gauge: GaugeMeasurements):
    gauge_col.insert_one(dict(gauge))
    return {"message": f"Created Gauge {gauge.title} Successfully"}
