import os
import configparser
from signal import pthread_kill
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from fastapi import APIRouter,File, UploadFile,Request,Depends
from pydantic import BaseModel
import json
from sqlalchemy import and_
from pydantic.types import FilePath
from sqlalchemy.sql.elements import Null
from sqlalchemy.sql.expression import null
import rasterio
from rasterio.session import AWSSession
from rasterstats import zonal_stats, point_query
from app.db.db import get_db
import datetime
import time
from shapely.geometry import shape
from app.schemas.index import Getlulc,Getlulctrend
from app.config.config import settings

LULCRASTER = settings.LULC_PATH
lulcRoute =APIRouter()
class lulc_dict(dict):
        # __init__ function
        def __init__(self):
            self = dict() 
        # Function to add key:value
        def add(self, key, value):
            self[key] = value

@lulcRoute .post('/getlulcarea', status_code=200)
async def get_area(details:Getlulc,db:Session=Depends(get_db)):
    lulc_files=[
        '01-01-2017',
        '01-01-2018',
        '01-01-2019',
        '01-01-2020',
        '01-01-2021',
        '01-01-2022'
    ]
    classes={
        '1':'Water',
        '2':'Trees',
        '4':'Flooded_vegetation',
        '5':'Crops',
        '7':'Built_Area',
        '8':'Bare_ground',
        '9':'Snow_or_Ice',
        '10':'Clouds',
        '11':'Rangeland'

    }

    
    lulcdict_obj = lulc_dict()
    for i in lulc_files:
        f_path=LULCRASTER+str(details.layer_id)+"/RASTER/"+i+".tif"
        stats = zonal_stats(details.geojson,
        f_path,
        categorical=True)[0]
        lulcdict_obj.add(i,stats)

    return{
        "code":200,
        "classes":classes,
        "data":lulcdict_obj
    }

@lulcRoute .post('/getlulcareapercentage', status_code=200)
async def get_area(details:Getlulc,db:Session=Depends(get_db)):
    lulc_files=[
        '01-01-2017',
        '01-01-2018',
        '01-01-2019',
        '01-01-2020',
        '01-01-2021',
        '01-01-2022'
    ]
    classes={
        '1':'Water',
        '2':'Trees',
        '4':'Flooded_vegetation',
        '5':'Crops',
        '7':'Built_Area',
        '8':'Bare_ground',
        '9':'Snow_or_Ice',
        '10':'Clouds',
        '11':'Rangeland'

    }
    classesid=[1,2,4,5,7,8,9,10,11]
    lulcdict_obj = lulc_dict()
    for i in lulc_files:
        f_path=LULCRASTER+str(details.layer_id)+"/RASTER/"+i+".tif"
        stats = zonal_stats(details.geojson,
        f_path,
        categorical=True)[0]
        totalpixels=sum(stats.values())
        for k, v in stats.items():
            pct = v * 100.0 / totalpixels
            stats.update({k:pct})
        lulcdict_obj.add(i,stats)
    lulc_trendobj=lulc_dict()
    for cl in classesid:
        lulc_trend=[]
        for k,v in lulcdict_obj.items():
            datem = datetime. datetime. strptime(k, "%d-%m-%Y")
            if cl in v:
                lulc_trend.append([datem.year,v[cl]])
            else:
                lulc_trend.append([datem.year,0])
        lulc_trendobj.add(cl,lulc_trend)
   
    return{
        "code":200,
        "classes":classes,
        "data":lulcdict_obj,
        'trend':lulc_trendobj
    }

@lulcRoute .post('/getlulctrend', status_code=200)
async def get_trend(details:Getlulctrend,db:Session=Depends(get_db)):
    lulc_files=[
        '01-01-2017',
        '01-01-2018',
        '01-01-2019',
        '01-01-2020',
        '01-01-2021',
        '01-01-2022'
    ]
    
    classesid=[1,2,4,5,7,8,9,10,11]

    lulcdict_obj = lulc_dict()
    for i in lulc_files:
        f_path=LULCRASTER+str(details.layer_id)+"/RASTER/"+i+".tif"
        stats = zonal_stats(details.geojson,
        f_path,
        categorical=True)[0]
        totalpixels=sum(stats.values())
        for k, v in stats.items():
            pct = v * 100.0 / totalpixels
            stats.update({k:pct})
        lulcdict_obj.add(i,stats)
    
    lulc_trend=[]
    for k,v in lulcdict_obj.items():
        datem = datetime. datetime. strptime(k, "%d-%m-%Y")
        if details.layer_id in v:
            lulc_trend.append([datem.year,v[details.layer_id]])
        else:
            lulc_trend.append([datem.year,0])
        
    return{
        'code':200,
        'trend':lulc_trend
    }
