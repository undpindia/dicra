import os
import time
import json
import rasterio
import configparser
from sqlalchemy import and_
from botocore import UNSIGNED
from datetime import datetime
from pydantic import BaseModel
from db.database import get_db
from boto3.session import Session
from shapely.geometry import shape
from botocore.client import Config
from models.index import Parameter
from pydantic.types import FilePath
from schemas.index import Customstat
from rasterio.session import AWSSession
from sqlalchemy.sql.elements import Null
from sqlalchemy.sql.expression import null
from fastapi.responses import FileResponse
from rasterstats import zonal_stats, point_query
from fastapi import APIRouter,File, UploadFile,Request,Depends

config = configparser.ConfigParser()
config.read('config/config.ini')
AWS_ACCESS_KEY = config['AWS']['ACCESSKEY']
AWS_SECRET_KEY = config['AWS']['SECRETKEY']
AZURE_BLOB_PATH= config['azureblob']['Blobpath']


custom=APIRouter()

def toUnix(datestring):
    unixtime=time.mktime(datetime.strptime(datestring,'%d-%m-%Y').timetuple())
    return int(unixtime*1000)
def getcentroid(polygon_feature):
    """
    Function for getting centroid of a polygon feature
    Parameters
    polygon_feature - Polygon feture object from the geojson
    """
    polygon_shape=shape(polygon_feature)
    centrod_of_polygon=polygon_shape.centroid
    return(centrod_of_polygon)


@custom.post('/getzstat', status_code=200)
async def get_zstat(details:Customstat,db:Session=Depends(get_db)):
    filedate = datetime.strptime(details.date, '%Y-%m-%d').strftime('%d-%m-%Y')
    file_path=AZURE_BLOB_PATH+details.parameter+'/RASTER/'+str(filedate)+'.tif'
    stats = zonal_stats(details.geojson,
    file_path,
    stats=['min','max','mean','count'])
    if(stats[0]['count']==0):
        pointvalue=point_query(getcentroid(details.geojson),file_path)
        if(pointvalue[0] is None):
            return{
                "code":404,
                "stat":{
                    'min':'N/A',
                    'max':'N/A',
                    'mean':'N/A'
                }
            }
        else:
            return{
                "code":200,
                "stat":{
                    'min':round(pointvalue[0],2),
                    'max':round(pointvalue[0],2),
                    'mean':round(pointvalue[0],2)
                }
            }
      
    return{
        "code":200,
        "stat":{
            'min':round(stats[0]['min'],2),
            'max':round(stats[0]['max'],2),
            'mean':round(stats[0]['mean'],2)
        }
    }
