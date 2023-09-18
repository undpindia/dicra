from sqlalchemy.orm import Session
from fastapi import APIRouter, Request, Response, status, Depends
from app.db.db import get_db
from app.models.index import Layer
from app.config.config import settings

vectorRouter = APIRouter()

@vectorRouter.get('/getvector', status_code=200)
async def get_vector_tile(layerid:int,type:str,request: Request,db: Session = Depends(get_db)):
    layer_z_x_y_format="""{z}/{x}/{y}.pbf"""
    tile_name=layer_z_x_y_format
    if type=='mandal':
        vectortileUrl=settings.CDN_ENDPOINT+f"{str(layerid)}/vector_tile_mandal/"+tile_name
    elif type=='district':
         vectortileUrl=settings.CDN_ENDPOINT+f"{str(layerid)}/vector_tile_district/"+tile_name
    return({
        "code":200,
        "layerUrl":vectortileUrl
    })





