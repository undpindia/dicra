from fastapi import APIRouter, Depends, FastAPI
from sqlalchemy.orm import Session
from app.db.db import get_db
# from models.index import Warehouse
from app.schemas.index import GetPoint
from app.config.config import settings
import json
import numpy as np
from shapely.geometry import shape, Point
from datetime import datetime
import time


cropfireRouter = APIRouter()

@cropfireRouter.get('/cropfire', status_code=200)
def get_cropfire(db:Session=Depends(get_db)):
    
    with open(settings.CROP_FIRE_PATH, 'r') as f:
        js = json.load(f)
    f.close()
    
    return{
        'code':200,
        'data':js
    }

@cropfireRouter.post('/cropfiregetpoint', status_code=200) 
def get_points(details:GetPoint,db: Session = Depends(get_db)):
    
    with open(settings.CROP_FIRE_PATH, 'r') as f:
        js = json.load(f)
    f.close()
    
    points_list = []
    js_shape=shape(details.geojson)
    for feature in js['features']:
        polygon = shape(feature['geometry'])
        datetime_object = datetime.strptime(feature['properties']['acq_date'], '%Y-%m-%d')
        start_date = datetime.strptime(details.startdate, '%Y-%m-%d')
        end_date = datetime.strptime(details.enddate, '%Y-%m-%d')
        if polygon.within(js_shape) and start_date.date()<datetime_object.date()<end_date.date():
            geometry = Point(feature['properties']['longitude'],feature['properties']['latitude'])
            properties= {
                "brightness": feature['properties']['brightness'],
                "scan": feature['properties']['scan'],
                "track": feature['properties']['track'],
                "acq_date": feature['properties']['acq_date'],
                "acq_time": feature['properties']['acq_time'],
                "satellite": feature['properties']['satellite'],
                "instrument": feature['properties']['instrument'],
                "confidence": feature['properties']['confidence'],
                "version": feature['properties']['version'],
                "bright_t31": feature['properties']['bright_t31'],
                "frp": feature['properties']['frp'],
                "daynight": feature['properties']['daynight'],
                "geometry": str(geometry)
            }
            points_list.append(properties)
    if len(points_list) == 0:
        return {'code': 404,
                'message': "No data available for the given date range"}
    else:
        return {'code':200, 'properties':points_list},{"count": len(points_list)}

@cropfireRouter.post('/cropfireeventstrend', status_code=200) 
def crop_fire_events_trend(details:GetPoint,db: Session = Depends(get_db)):
    points_list = []
    trend_list=[]
    
    with open(settings.CROP_FIRE_PATH, 'r') as f:
        js = json.load(f)
    f.close()
    
    js_shape=shape(details.geojson)
    for feature in js['features']:
        polygon = shape(feature['geometry'])
        datetime_object = datetime.strptime(feature['properties']['acq_date'], '%Y-%m-%d')
        start_date = datetime.strptime(details.startdate, '%Y-%m-%d')
        end_date = datetime.strptime(details.enddate, '%Y-%m-%d')
        if polygon.within(js_shape) and start_date.date()<datetime_object.date()<end_date.date():
            acq_date=feature['properties']['acq_date']
            points_list.append(acq_date)
    
    v,c = np.unique(points_list, return_counts=True)
    if v.size != 0:
        values=v.tolist()
        count=c.tolist()
        for val,cnt in zip(values,count):
            unix=time.mktime(datetime.strptime(val, "%Y-%m-%d").timetuple())
            trend_list.append([unix*1000,cnt])

        return{
            'code':200,
            'trend':trend_list
            
        }
    else:
         return{
            'code': 404,
            'message': "No data available for the given date range"
            
        }
