from datetime import datetime
from fastapi import APIRouter, Depends, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from collections import deque
import json

from models.UserModel import RoleEnum
from routes import auth

monitor_router = APIRouter()
templates = Jinja2Templates(directory="templates")

# Store last 100 messages
message_history = deque(maxlen=100)

def add_message(topic: str, payload: any):
    message_history.append({
        "topic": topic,
        "payload": payload,
        "timestamp": str(datetime.now())
    })

@monitor_router.get("/monitor", response_class=HTMLResponse)
async def show_monitor(request: Request, login_user: dict = Depends(auth.check_user_access(RoleEnum.admin))):
    return templates.TemplateResponse("monitor.html", {"request": request})

@monitor_router.get("/api/messages")
async def get_messages():
    return JSONResponse(content=list(message_history))
