from bson import ObjectId
from ChartSchema import delete_charts_array
from configurations import devices_col
from GaugeSchema import delete_gauges_array


def project_individual_serial(projects):
    return {
        "id": str(projects["_id"]),
        "title": projects["title"],
        "devices": projects["devices"],
        "user_id": projects["user_id"],
    }


def project_list_serial(projects) -> list:
    return [project_individual_serial(project) for project in projects]


async def delete_devices_array(devices: list[ObjectId]):
    for i in devices:
        delete_charts_array(i["charts"])
        delete_gauges_array(i["gauges"])

    devices_col.delete_many({"_id": {"$in": devices}})
