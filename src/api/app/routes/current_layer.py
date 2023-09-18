from sqlalchemy.orm import Session
from fastapi import APIRouter, Request, Response, status, Depends
from app.db.db import get_db
from app.models.index import Parameter
from app.schemas.index import Createparameter
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from datetime import datetime
from sqlalchemy import func
from app.config.config import settings

currentlayerRouter = APIRouter()
@currentlayerRouter.get('/currentvector', status_code=200)
async def current_vector(layer_id:int,admbound:str,db: Session = Depends(get_db)):
    latest_available_date = (
        db.query(func.max(Parameter.available_date))
        .filter(Parameter.layer_id == layer_id)
        .scalar()
    )
    filedate = datetime.strptime(str(latest_available_date), '%Y-%m-%d').strftime('%d-%m-%Y')
    if admbound=='MANDAL':
        currentfile=str(layer_id)+"/VECTOR/MANDAL/"+str(filedate)+".geojson"
        currentfileUrl=settings.CDN_ENDPOINT+currentfile
    elif admbound=="DISTRICT":
        currentfile=str(layer_id)+"/VECTOR/DISTRICT/"+str(filedate)+".geojson"
        currentfileUrl=settings.CDN_ENDPOINT+currentfile
    else:
        return({
            "code":404,
            "message":"Administrative bounday not found"
        })
    return({
        "code":200,
        "vectorUrl":currentfileUrl
    })