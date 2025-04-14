from bson import ObjectId
from configurations import chart_col, gauge_col


def device_individual_serial(devices):
    return {
        "id": str(devices["_id"]),
        "device_name": devices["device_name"],
        "created_at": devices["created_at"],
        "updated_at": devices["updated_at"],
    }


def device_list_serial(devices) -> list:
    return [device_individual_serial(device) for device in devices]


async def delete_gauges_array(gauges: list[ObjectId]):
    gauge_col.delete_many({"_id": {"$in": gauges}})


async def delete_charts_array(charts: list[ObjectId]):
    chart_col.delete_many({"_id": {"$in": charts}})
