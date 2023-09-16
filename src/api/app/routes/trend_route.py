import time
import math
from sqlalchemy import and_
from app.db.db import get_db
from datetime import datetime
from shapely.geometry import shape
from app.models.index import Layer
from sqlalchemy.orm import Session
from app.config.config import settings
from app.schemas.index import Gettrend, Getpointtrend
from app.models.index import Parameter
from fastapi import APIRouter, Request, Response, status, Depends
from app.utils.util import getcentroid,toUnix,checknodata
import shapely

from rasterstats import zonal_stats, point_query

PARAMETER_PATH=settings.PARAMETERS_PATH
trendRouter = APIRouter()
@trendRouter.post('/gettrend', status_code=200)
async def get_trend(details:Gettrend,db:Session=Depends(get_db)) -> dict:
  format="%Y-%m-%d"
  try:
      datetime.strptime(details.startdate, format)
      datetime.strptime(details.enddate, format)
  except ValueError:
    return {
        "message":"start date and end date in should be YYYY-MM-DD"
    }
  availabledates=db.query(Parameter.available_date).filter(
    and_(Parameter.layer_id==details.layer_id,Parameter.available_date.between(
      str(details.startdate),str(details.enddate)
    ))).order_by(Parameter.available_date).all()
  db.close()
  if(len(availabledates)<1):
    return {
      'code':404,
      'message':"No data available for the given date range"
    }
  else:
    zstats=[]
    for i in availabledates:
      try:
          filedate = datetime.strptime(str(i.available_date), '%Y-%m-%d').strftime('%d-%m-%Y')
          file_path=PARAMETER_PATH+str(details.layer_id)+'/RASTER/'+str(filedate)+'.tif'
          stats = zonal_stats(details.geojson,
            file_path,
            stats=['mean','count','sum'])
          # if(details.layer_id==42 and details.layer_id==73 and details.layer_id==74 and details.layer_id==75): 
          if details.layer_id in [42, 73, 74, 75, 101, 102, 103]:  #put population layer id here
              zstats.append([toUnix(filedate),round(stats[0]['sum'],2)])
          elif(stats[0]['count']==0):
            pointvalue=point_query(getcentroid(details.geojson),file_path)
            if(pointvalue[0] is None or math.isnan(pointvalue[0])):
              zstats.append([toUnix(filedate),None]) 
            else:
              zstats.append([toUnix(filedate),round(pointvalue[0],2)]) 
          else:
              zstats.append(checknodata(toUnix(filedate),stats[0]['mean']))
      except Exception as e:
         continue
    return {
          'code':200,
          'trend':zstats
        }
  
@trendRouter.post('/getppointtrend', status_code=200)
async def get_point_trend(details:Getpointtrend,db:Session=Depends(get_db)) -> dict:
  format="%Y-%m-%d"
  try:
      datetime.strptime(details.startdate, format)
      datetime.strptime(details.enddate, format)
  except ValueError:
    return {
        "message":"start date and end date in should be YYYY-MM-DD"
    }
  availabledates=db.query(Parameter.available_date).filter(
    and_(Parameter.layer_id==details.layer_id,Parameter.available_date.between(
      str(details.startdate),str(details.enddate)
    ))).order_by(Parameter.available_date).all()
  db.close()
  if(len(availabledates)<1):
    return {
      'code':404,
      'message':"No data available for the given date range"
    }
  else:
    zstats=[]
    for i in availabledates:
      filedate = datetime.strptime(str(i.available_date), '%Y-%m-%d').strftime('%d-%m-%Y')
      file_path=PARAMETER_PATH+str(details.layer_id)+'/RASTER/'+str(filedate)+'.tif'
      
      point = shapely.Point(details.longitude, details.latitude)
      
      pointvalue=point_query(point,file_path)
      if(pointvalue[0] is None or math.isnan(pointvalue[0])):
        zstats.append([toUnix(filedate),None]) 
      else:
        zstats.append([toUnix(filedate),round(pointvalue[0],2)])

    return {
          'code':200,
          'trend':zstats
        }