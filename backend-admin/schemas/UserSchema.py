from bson import ObjectId
from configurations import devices_col, logs_col, project_col
from schemas.DeviceSchema import device_list_serial
from schemas.ProjectSchema import delete_devices_array


def user_individual_serial(users):
    return {
        "id": str(users["_id"]),
        "username": users["username"],
        "email": users["email"],
        "password": users["password"],
        
        "role": users["role"],
        "created_at": users["created_at"],
        "updated_at": users["updated_at"],
    }


def get_project_device(projects: list):
    proj_list = []
    for i in projects:
        proj = project_col.find_one({"_id": i})
        if proj:
            proj_list.append(
                {
                    "id": str(proj["_id"]),
                    "title": proj["title"],
                    "devices": device_list_serial(
                        devices_col.find({"_id": {"$in": proj["devices"]}})
                    ),
                    "created_at": proj["created_at"],
                    "updated_at": proj["updated_at"],
                }
            )
    return proj_list


def user_list_serial(users) -> list:
    return [user_individual_serial(user) for user in users]


async def delete_projects_array(projects: list[ObjectId]):
    for i in projects:
        proj = project_col.find_one({"_id": i})
        if proj:
            await delete_devices_array(proj["devices"])

    project_col.delete_many({"_id": {"$in": projects}})


async def delete_logs_array(logs: list[ObjectId]):
    logs_col.delete_many({"_id": {"$in": logs}})
