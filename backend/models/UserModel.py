from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class GaugeMeasurements(BaseModel):
    topic: str
    title: str
    max_value: float
    min_value: float
    m_type: str
    unit: str
    device_id: str
    updated_at: datetime
    created_at: datetime


class ChartMeasurement(BaseModel):
    title: str
    topic: str
    configs: object
    device_id: str
    updated_at: datetime
    created_at: datetime


class Devices(BaseModel):
    device_name: str
    charts: Optional[str] = []
    gauges: Optional[str] = []
    project_id: str
    updated_at: datetime
    created_at: datetime


class Project(BaseModel):
    title: str
    devices: Optional[str] = []
    user_id: str
    updated_at: datetime
    created_at: datetime


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
    updated_at: datetime
    created_at: datetime


class RoleEnum(str, Enum):
    admin = "admin"
    user = "user"


class User(BaseModel):
    username: str
    email: str
    password: str = Field(min_length=6)
    project: Optional[str] = []
    logs: Optional[str] = []
    role: RoleEnum = RoleEnum.user
    updated_at: datetime
    created_at: datetime
