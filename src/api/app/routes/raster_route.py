from sqlalchemy.orm import Session
from fastapi import APIRouter, Request, Response, status, Depends
from app.db.db import get_db
from app.models.index import Layer
from app.config.config import settings

rasterRouter = APIRouter()

@rasterRouter.get('/getrastorurl', status_code=200)
async def get_raster_tile(layerid:int,request: Request,db: Session = Depends(get_db)):
    tile_name=str(layerid)+"/RASTER_TILE/raster_tile.tif"
    rastrerTileurl=settings.CDN_ENDPOINT+tile_name
    return({
        "code":200,
        "rasterlayerUrl":rastrerTileurl
    })