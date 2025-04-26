import json
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from jwcrypto import jwk, jwt

SAVE_TO = "./private.json"


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
    something = key["kid"]
    return something


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


async def on_start():
    jwks = generate_jwks(3)
    claims = {}
    claims["client"] = "myclient"
    claims["username"] = "myuser"
    jwt = issue_jws(jwks[0], "RS256", claims)

    print("[JWT]\n%s\n" % (jwt))
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


@app.get("/")
async def get_mqtt_key():
    return json.loads(load_public_jwks())


@app.get("/mqtt/auth")
async def get_mqtt_auth():
    jwks = generate_jwks(3)
    claims = {}
    claims["client"] = "myclient"
    claims["username"] = "myuser"
    jwt = issue_jws(jwks[0], "RS256", claims)

    save_jwks(jwks)

    return {"pass": f"{jwt}"}


# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
