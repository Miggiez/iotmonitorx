import json
import os
import time
from contextlib import asynccontextmanager
from typing import Annotated

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from jwcrypto import jwk, jwt
from passlib.context import CryptContext
from pymongo.errors import ConnectionFailure
from pymongo.mongo_client import MongoClient

SAVE_TO = "./private.json"

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/")


def check_db_connection():
    try:
        client = MongoClient(os.environ["MONGODB_URI"], serverSelectionTimeoutMS=2000)
        # Triggering a command to check connection
        client.admin.command("ping")
        print("MongoDB is running!")
        return client
    except ConnectionFailure:
        print("Error: MongoDB is not running!")


client = check_db_connection()
if client:
    print("MongoDB connection established successfully.")
    db = client.user_db
    user_col = db["user_collection"]


def issue_jws(key, alg, claims):
    header = {}
    header["alg"] = alg
    header["typ"] = "JWT"
    header["kid"] = get_kid(key)
    token = jwt.JWT(header=header, claims=claims)
    token.make_signed_token(key)
    return token.serialize()


def generate_jwks(number):
    jwks = []
    for kid0 in range(1, number + 1):
        kid = str(kid0)
        key = jwk.JWK.generate(kty="RSA", size=2048, alg="RSA256", use="sig", kid=kid)
        jwks.append(key)

    return jwks


def get_kid(key):
    return key.export(private_key=False, as_dict=True).get("kid")


def save_jwks(jwks):
    private_file = open(SAVE_TO, mode="w+")
    private_keys = []
    for jwkk in jwks:
        private_keys.append(jwkk.export(private_key=True, as_dict=True))

    json.dump({"keys": private_keys}, private_file)
    private_file.close()


def load_public_jwks():
    private_file = open(SAVE_TO, mode="r")
    jwks = jwk.JWKSet.from_json(private_file.read())
    private_file.close()
    return jwks.export(private_keys=False)


def load_jwks_key():
    private_file = open(SAVE_TO, mode="r")
    jwks = jwk.JWKSet.from_json(private_file.read())
    private_file.close()
    return jwks


async def on_start():
    jwks = generate_jwks(3)
    save_jwks(jwks)


@asynccontextmanager
async def _lifespan(_app: FastAPI):
    await on_start()
    yield


app = FastAPI(lifespan=_lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL like ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", status_code=status.HTTP_200_OK)
async def get_mqtt_key(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if token != os.environ["MQTT_SECRET"]:
        raise credentials_exception

    return json.loads(load_public_jwks())


def isAuthorized(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, os.environ["SECRET"], algorithms=os.environ["ALGORITHM"]
        )
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = user_col.find_one({"email": email})
    if user is None:
        raise credentials_exception

    return user["role"]


@app.get("/mqtt/auth", status_code=status.HTTP_200_OK)
async def get_mqtt_auth(role: Annotated[str, Depends(isAuthorized)]):
    jwks = load_jwks_key()
    jwks = [*jwks["keys"]]
    expires_in = 12000
    claims = {}
    claims["client"] = "myclient"
    claims["username"] = "myuser"
    claims["exp"] = int(time.time()) + expires_in
    jwt = issue_jws(jwks[0], "RS256", claims)

    save_jwks(jwks)

    return {"pass": f"{jwt}"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)
