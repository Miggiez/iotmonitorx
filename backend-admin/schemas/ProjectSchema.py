from bson import ObjectId
from configurations import devices_col

from schemas.DeviceSchema import (
    delete_charts_array,
    delete_gauges_array,
    delete_switches_array,
)

# def project_individual_serial(projects):
#     return {
#         "id": str(projects["_id"]),
#         "title": projects["title"],
#         "created_at": projects["created_at"],
#         "updated_at": projects["updated_at"],
#     }


# def project_list_serial(projects) -> list:
#     return [project_individual_serial(project) for project in projects]


async def delete_devices_array(devices: list[ObjectId]):
    for i in devices:
        dev = devices_col.find_one({"_id": i})
        if dev:
            await delete_charts_array(dev["charts"])
            await delete_gauges_array(dev["gauges"])
            await delete_switches_array(dev["switches"])

    devices_col.delete_many({"_id": {"$in": devices}})
