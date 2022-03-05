
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
from botocore.client import Config
from models.index import Parameter
from shapely.geometry import shape
from schemas.index import Gettrend
from pydantic.types import FilePath
from rasterio.session import AWSSession
from sqlalchemy.sql.elements import Null
from fastapi.responses import FileResponse
from sqlalchemy.sql.expression import null
from rasterstats import zonal_stats, point_query
from fastapi import APIRouter,File, UploadFile,Request,Depends


config = configparser.ConfigParser()
config.read('config/config.ini')
AWS_ACCESS_KEY = config['AWS']['ACCESSKEY']
AWS_SECRET_KEY = config['AWS']['SECRETKEY']

trend=APIRouter()

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

class Layer(BaseModel):
    layerdate:str

@trend.post('/gettrend', status_code=200)
async def get_trend(details:Gettrend,db:Session=Depends(get_db)):
  format="%Y-%m-%d"
  try:
      datetime.strptime(details.startdate, format)
      datetime.strptime(details.enddate, format)
  except ValueError:
    return {
        "message":"start date and end date in should be YYYY-MM-DD"
    }
  availabledates=db.query(Parameter.available_date).filter(
    and_(Parameter.parameter_name==details.parameter,Parameter.available_date.between(
      str(details.startdate),str(details.enddate)
    ))).order_by(Parameter.available_date).all()
  if(len(availabledates)<1):
    return {
      'code':404,
      'message':"No data available for the given date range"
    }
  else:
    zstats=[]
    for i in availabledates:
      filedate = datetime.strptime(str(i.available_date), '%Y-%m-%d').strftime('%d-%m-%Y')
      file_path='https://undpdataforpolicy.blob.core.windows.net/undp-data-for-policy/parameters/'+details.parameter+'/RASTER/'+str(filedate)+'.tif'
      stats = zonal_stats(details.geojson,
        file_path,
        stats=['mean','count'])
      if(stats[0]['count']==0):
         pointvalue=point_query(getcentroid(details.geojson),file_path)
         if(pointvalue[0] is None):
           zstats.append([toUnix(filedate),None]) 
         else:
           zstats.append([toUnix(filedate),round(pointvalue[0],2)]) 
      else:
        zstats.append([toUnix(filedate),round(stats[0]['mean'],2)])
      

    return {
          'code':200,
          'trend':zstats
        }
