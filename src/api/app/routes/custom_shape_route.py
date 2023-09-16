import time
import math
from sqlalchemy import and_
from app.db.db import get_db
from datetime import datetime
from shapely.geometry import shape
from app.models.index import Layer
from sqlalchemy.orm import Session
from app.config.config import settings
from app.schemas.index import Customstat
from app.models.index import Parameter
from fastapi import APIRouter, Request, Response, status, Depends
from app.utils.util import getcentroid,toUnix,checknodata

from rasterstats import zonal_stats, point_query


PARAMETER_PATH = settings.CDN_ENDPOINT

customshapeRouter=APIRouter()


@customshapeRouter.post('/getzstat', status_code=200)
async def get_zstat(details:Customstat,db:Session=Depends(get_db)):
    filedate = datetime.strptime(details.date, '%Y-%m-%d').strftime('%d-%m-%Y')
    file_path=PARAMETER_PATH+str(details.layer_id)+'/RASTER/'+str(filedate)+'.tif'
    stats = zonal_stats(details.geojson,
    file_path,
    stats=['min','max','mean','count','sum'])
    if(stats[0]['count']==0):
        pointvalue=point_query(getcentroid(details.geojson),file_path)
        if(pointvalue[0] is None):
            return{
                "code":404,
                "stat":{
                    'min':'N/A',
                    'max':'N/A',
                    'mean':'N/A',
                    'sum':'N/A'
                }
            }
        else:
            return{
                "code":200,
                "stat":{
                    'min':round(pointvalue[0],2),
                    'max':round(pointvalue[0],2),
                    'mean':round(pointvalue[0],2),
                    'sum':round(pointvalue[0],2)
                }
            }
      
    return{
        "code":200,
        "stat":{
            'min':round(stats[0]['min'],2),
            'max':round(stats[0]['max'],2),
            'mean':round(stats[0]['mean'],2),
            'sum':round(stats[0]['sum'],2)
        }
    }
