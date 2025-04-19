from datetime import datetime

from bson import ObjectId
from configurations import devices_col, project_col, user_col
from fastapi import APIRouter, HTTPException, status
from models.UserModel import LevelEnum, LogEnum, Logs, Project
from routes.logs import post_logs
from schemas.DeviceSchema import device_list_serial
from schemas.ProjectSchema import delete_devices_array

project_router = APIRouter(prefix="/projects", tags=["projects"])


@project_router.post("/create/project", status_code=status.HTTP_201_CREATED)
async def post_project(projects: Project):
    user = user_col.find_one({"_id": ObjectId(projects.user_id)})
    if not user:
        await post_logs(
            logs=Logs(
                l_type=LogEnum.error,
                description=f"User with id {projects.user_id} is not found. Failed to create Project!",
                level=LevelEnum.project,
                user_id=projects.user_id,
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {projects.user_id} is not found. Failed to create Project!",
        )
    project = Project(
        title=projects.title,
        devices=projects.devices,
        user_id=projects.user_id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    id = project_col.insert_one(dict(project)).inserted_id
    user_col.find_one_and_update(
        {"_id": ObjectId(project.user_id)}, {"$push": {"project": id}}
    )

    await post_logs(
        logs=Logs(
            l_type=LogEnum.message,
            description=f"Created Projects {project.title} Successfully!",
            level=LevelEnum.project,
            user_id=projects.user_id,
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )

    return {"message": f"Created Projects {project.title} Successfully!"}


@project_router.put("/edit/{id}", status_code=status.HTTP_200_OK)
async def edit_project(id: str, projects: Project):
    proj = project_col.find_one({"_id": ObjectId(id)})
    if not proj:
        await post_logs(
            logs=Logs(
                l_type=LogEnum.error,
                description=f"Project with id {id} is not found. Failed to edit Project!",
                level=LevelEnum.project,
                user_id=proj["user_id"],
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {id} is not found. Failed to edit Project!",
        )
    project = Project(
        title=projects.title,
        devices=proj["devices"],
        user_id=projects.user_id,
        created_at=proj["created_at"],
        updated_at=datetime.now(),
    )
    project_col.update_one({"_id": ObjectId(id)}, {"$set": dict(project)})

    await post_logs(
        logs=Logs(
            l_type=LogEnum.message,
            description=f"Successfully edited Project {id}",
            level=LevelEnum.project,
            user_id=proj["user_id"],
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Successfully edited Project {id}"}


@project_router.delete("/delete/{id}", status_code=status.HTTP_200_OK)
async def delete_project(id: str):
    project = project_col.find_one({"_id": ObjectId(id)})
    if project is None:
        await post_logs(
            logs=Logs(
                l_type=LogEnum.error,
                description=f"Project with id {id} is not found. Failed to delete Project!",
                level=LevelEnum.project,
                user_id=project["user_id"],
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {id} is not found. Failed to delete Project!",
        )
    user_col.update_one(
        {"_id": ObjectId(project["user_id"])},
        {"$pull": {"project": ObjectId(id)}},
    )
    await delete_devices_array(project["devices"])
    project_col.delete_one({"_id": ObjectId(id)})
    await post_logs(
        logs=Logs(
            l_type=LogEnum.message,
            description=f"Successfully deleted Project {id}",
            level=LevelEnum.project,
            user_id=project["user_id"],
            updated_at=datetime.now(),
            created_at=datetime.now(),
        )
    )
    return {"message": f"Successfully deleted Project {id}"}


@project_router.get("/{id}/getall/devices", status_code=status.HTTP_200_OK)
async def get_devices(id: str):
    project = project_col.find_one({"_id": ObjectId(id)})
    if not project:
        await post_logs(
            logs=Logs(
                l_type=LogEnum.error,
                description=f"Project with id {id} is not found. Failed to get all Devices!",
                level=LevelEnum.project,
                user_id=project["user_id"],
                updated_at=datetime.now(),
                created_at=datetime.now(),
            )
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {id} does not exist!",
        )
    devices = device_list_serial(devices_col.find({"_id": {"$in": project["devices"]}}))
    return devices
