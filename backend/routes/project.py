from datetime import datetime

from bson import ObjectId
from configurations import devices_col, project_col, user_col
from fastapi import APIRouter, HTTPException, status
from models.UserModel import Project
from schemas.DeviceSchema import device_list_serial
from schemas.ProjectSchema import delete_devices_array

project_router = APIRouter(prefix="/projects", tags=["projects"])


@project_router.post("/create/project", status_code=status.HTTP_201_CREATED)
async def post_project(projects: Project):
    user = user_col.find_one({"_id": ObjectId(projects.user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {projects.user_id} does not exist!",
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
    return {"message": f"Created Projects {project.title} Successfully!"}


@project_router.put("/edit/{id}", status_code=status.HTTP_200_OK)
async def edit_project(id: str, projects: Project):
    proj = project_col.find_one({"_id": ObjectId(id)})
    if not proj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project with id {id} does not exist!",
        )
    project = Project(
        title=projects.title,
        devices=projects.devices,
        user_id=projects.user_id,
        created_at=proj["created_at"],
        updated_at=datetime.now(),
    )
    project_col.update_one({"_id": ObjectId(id)}, {"$set": dict(project)})
    return {"message": f"Successfully edited Project {id}"}


@project_router.delete("/delete/{id}", status_code=status.HTTP_200_OK)
async def delete_project(id: str):
    project = project_col.find_one({"_id": ObjectId(id)})
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You cannot delete Device id: {id}, because this does not exist",
        )
    user_col.update_one(
        {"_id": ObjectId(project["user_id"])},
        {"$pull": {"project": ObjectId(id)}},
    )
    await delete_devices_array(project["devices"])
    project_col.delete_one({"_id": ObjectId(id)})
    return {"message": f"Successfully deleted Project {id}"}


@project_router.get("/{id}/getall/devices", status_code=status.HTTP_200_OK)
async def get_devices(id: str):
    project = project_col.find_one({"_id": ObjectId(id)})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {id} does not exist!",
        )
    devices = device_list_serial(devices_col.find({"_id": {"$in": project["devices"]}}))
    return devices
