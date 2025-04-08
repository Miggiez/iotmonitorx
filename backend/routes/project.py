from configurations import project_col
from fastapi import APIRouter
from models.UserModel import Project
from schemas.ProjectSchema import project_list_serial

project_router = APIRouter(prefix="/projects", tags=["projects"])


@project_router.get("/getall")
async def get_projects():
    project = project_list_serial(project_col.find())
    return project


@project_router.post("/create/projects")
async def post_project(project: Project):
    project_col.insert_one(dict(project))
    return {"message": "Created User Successfully!"}
