from bson import ObjectId
from configurations import logs_col, project_col
from DeviceSchema import delete_devices_array


def user_individual_serial(users):
    return {
        "id": str(users["_id"]),
        "username": users["username"],
        "email": users["email"],
        "password": users["password"],
        "project": users["project"],
        "logs": users["logs"],
        "role": users["role"],
    }


def user_list_serial(users) -> list:
    return [user_individual_serial(user) for user in users]


async def delete_projects_array(projects: list[ObjectId]):
    for i in projects:
        delete_devices_array(i["devices"])

    project_col.delete_many({"_id": {"$in": projects}})


async def delete_logs_array(logs: list[ObjectId]):
    logs_col.delete_many({"_id": {"$in": logs}})
