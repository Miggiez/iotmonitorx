from datetime import datetime, timedelta

from configurations import user_col
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

auth_router = APIRouter(prefix="/auth", tags=["auth"])

# JWT Config
SECRET_KEY = "your_super_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Hashing and OAuth2 setup
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# Pydantic model for login
class LoginRequest(BaseModel):
    email: str
    password: str


# ------------------ Token Utility ------------------ #
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@auth_router.get("/verif", status_code=status.HTTP_200_OK)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = user_col.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "role": user["role"],
        "email": user["email"],
    }


# ------------------ Auth Routes ------------------ #
@auth_router.post("/auth/login", status_code=status.HTTP_200_OK)
def login_user(login_request: LoginRequest):
    user = user_col.find_one({"email": login_request.email})
    if not user or not bcrypt_context.verify(login_request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = create_access_token(
        data={"sub": user["email"]},
        expires_delta=timedelta(minutes=20),
    )
    return {"access_token": access_token, "token_type": "bearer"}
