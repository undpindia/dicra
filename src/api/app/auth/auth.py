from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import HTTPException, Security
from app.config.config import settings


def auth(auth: HTTPAuthorizationCredentials = Security(HTTPBearer())):
    if auth.credentials == settings.AUTH_TOKEN:
        return True
    else:
        raise HTTPException(status_code=401, detail='Invalid token')
    