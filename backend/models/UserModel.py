from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class GaugeMeasurements(BaseModel):
    topic: str
    title: str
    max_value: float
    min_value: float
    m_type: str
    unit: str
    device_id: str
    updated_at: datetime = None
    created_at: datetime = None


class ChartMeasurement(BaseModel):
    title: str
    topic: str
    name: str
    color: str
    device_id: str
    updated_at: datetime = None
    created_at: datetime = None


class Devices(BaseModel):
    device_name: str
    charts: list[Any] = []
    gauges: list[Any] = []
    switches: list[Any] = []
    project_id: str
    updated_at: datetime = None
    created_at: datetime = None


class SwitchButton(BaseModel):
    switch_name: str
    state: bool
    device_id: str
    updated_at: datetime = None
    created_at: datetime = None


class Project(BaseModel):
    title: str
    devices: list[Any] = []
    user_id: str
    updated_at: datetime = None
    created_at: datetime = None


class LogEnum(str, Enum):
    message = "message"
    error = "error"


class LevelEnum(str, Enum):
    project = "project"
    device = "devices"
    user = "user"
    chart = "chart"
    gaguge = "gauge"


class Logs(BaseModel):
    title: str
    l_type: LogEnum
    description: str
    level: LevelEnum
    user_id: str
    updated_at: datetime = None
    created_at: datetime = None


class RoleEnum(str, Enum):
    admin = "admin"
    user = "user"


class User(BaseModel):
    username: str
    email: str
    password: str = Field(min_length=6)
    project: list[Any] = []
    logs: list[Any] = []
    role: RoleEnum = RoleEnum.user
    updated_at: datetime = None
    created_at: datetime = None
