from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn



# from routes.admin_user import admin_user_router
# from routes.UserWeb import admin_web_router
# from routes.auth import auth_router
from fastapi.middleware.cors import CORSMiddleware
from controller.DataCollector import _lifespan




app = FastAPI(lifespan=_lifespan)
# app = FastAPI()
# Mount static files with correct directory path
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL like ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    from routes.admin_user import admin_user_router
    from routes.UserWeb import admin_web_router
    from routes.auth import auth_router
    from routes.monitor import monitor_router
    from controller.DataCollector import fast_mq
    app.include_router(admin_user_router)
    app.include_router(admin_web_router)
    app.include_router(monitor_router)
except Exception as e:
    print(f"Error including routers: {e}")
# app.include_router(auth_router)




if __name__ == "__main__":
    uvicorn.run(app=app, host="127.0.0.1", port=8001)
