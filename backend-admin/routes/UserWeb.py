import json
from datetime import datetime
from fastapi.templating import Jinja2Templates
from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import ValidationError
from routes import auth
from routes import admin_user as UserRoute
from configurations import user_col
from models.UserModel import RoleEnum, User
from passlib.context import CryptContext

templates = Jinja2Templates(directory="templates")
admin_web_router = APIRouter()
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@admin_web_router.get("/users", response_class=HTMLResponse, tags=["Project_Controller"])
async def admin_users(
    request: Request, 
    # user: dict = Depends(auth.check_user_access(RoleEnum.admin)), 
    message: str = None, 
    message_type: str = None,
    login_user: dict = Depends(auth.check_user_access(RoleEnum.admin))
):
    users = await UserRoute.find_all_users()
    context = {
        "request": request,
        # "username": user["username"],
        "users": users,
        "message": message,
        "message_type": message_type
    }
    return templates.TemplateResponse("users.html", context=context)

@admin_web_router.get("/user/{user_id}/edit", response_class=HTMLResponse, tags=["Project_Controller"])
async def admin_edit_user_form(
    user_id: str, 
    request: Request, 
    user: dict = Depends(auth.check_user_access(RoleEnum.admin))
):
    target_user = await UserRoute.find_user_by_id(user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    context = {
        "request": request,
        "user_data": target_user,
        "username": user["username"]
    }
    return templates.TemplateResponse("user_form.html", context)

@admin_web_router.post("/user/{user_id}/edit", tags=["Project_Controller"])
async def update_user_info(
    user_id: str,
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: RoleEnum = Form(...),
    login_user: dict = Depends(auth.check_user_access(RoleEnum.admin))
):
    user_data = {
            "username": username,
            "email": email,
            "role": role,
            "password": password
    }
    user2 = User(**user_data)
    updated_user = await UserRoute.update_user(user_id, user2)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    else:
        message = "User updated successfully"
    message_type = "info"
    return RedirectResponse(url=f"/users?message={message}&message_type=info", status_code=303)

@admin_web_router.post("/user/{user_id}/delete", tags=["Project_Controller"])
async def admin_delete_user(
    user_id: str,
    user: dict = Depends(auth.check_user_access(RoleEnum.admin)),
    login_user: dict = Depends(auth.check_user_access(RoleEnum.admin))
):
    response = await UserRoute.delete_user(user_id)
    message = response["message"]
    return RedirectResponse(url=f"/users?message={message}&message_type=info", status_code=303)

# Move these routes outside admin prefix
@admin_web_router.get("/register/user", response_class=HTMLResponse, tags=["User_Registration"])
def register_form(request: Request):
    return templates.TemplateResponse("user_form.html", {"request": request, "user_data": {}})

@admin_web_router.post("/register/user", tags=["User_Registration"])
async def register_user(request: Request, username: str = Form(...), email: str = Form(...), 
                       password: str = Form(...), role: str = Form(...),
                        login_user: dict = Depends(auth.check_user_access(RoleEnum.admin))
                       
                       ):
    message_type = "info"
    message = ""
    try:
        hashed_password = bcrypt_context.hash(password)
        current_time = datetime.now()
        user_data = {
            "username": username,
            "email": email,
            "role": role,
            "password": hashed_password,
            "project": [],
            "logs": [],
            "created_at": current_time,
            "updated_at": current_time
        }
        # Convert dict to User model
        user_model = User(**user_data)
        response = await UserRoute.register_user(user_model)
        if isinstance(response, dict) and "message" in response:
            message = response["message"]
        else:
            message = "User registered successfully"
        # message = response["message"] if isinstance(response, dict) else str(response)
        message_type = "info"
    except Exception as e:
        message = str(e)
        message_type = "error"
        print(f"Registration error: {e}")
    return RedirectResponse(url=f"/users?message={message}&message_type={message_type}", 
                          status_code=303)

@admin_web_router.get("/", response_class=HTMLResponse)
def root(request:Request):
    return RedirectResponse("/login", status_code=303)


@admin_web_router.get("/login", response_class=HTMLResponse)
def login_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@admin_web_router.post("/login")
def login(response: Response, email: str = Form(...), password: str = Form(...)):
    user = user_col.find_one({"email": email})
    if not user or not bcrypt_context.verify(password, user["password"]):
        return templates.TemplateResponse("login.html", {"request": {}, "error": "Invalid credentials"})
   
    token = auth.create_access_token({"sub": email})
    res = RedirectResponse("/users", status_code=303)
    res.set_cookie("access_token", token, httponly=True)
    return res

@admin_web_router.get("/logout")
def logout():
    res = RedirectResponse("/login", status_code=303)
    res.delete_cookie("access_token")
    return res