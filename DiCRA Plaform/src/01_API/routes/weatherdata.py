import json
import itertools
import configparser
import decimal, datetime
from logging import exception
from itertools import groupby
from fastapi import APIRouter
from db.database import get_db
from operator import itemgetter
from models.index import Weather
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends
from sqlalchemy.sql.expression import true
from schemas.index import Getweather,Returnweather
from fastapi_pagination import LimitOffsetPage, Page, add_pagination,paginate






from pydantic import BaseModel


weather= APIRouter()

@weather.post('/getweather', status_code=200)
async def get_weathertrend(details:Getweather,db:Session=Depends(get_db)):
    try:
        query="SELECT extract(epoch from data_date)*1000 as unix,"+details.parameter+"::FLOAT FROM tbl_weather WHERE data_date BETWEEN '"+details.start_date+"' AND '"+details.end_date+"' AND district='"+details.district+"' AND mandal='"+details.mandal+"'"
        data=db.execute(query)
        results = [list(row) for row in data]
        return{
            'code':200,
            'trend':results
        }
    except:
        return{
            "message":"Error occured please provide valid parameters"
        }
@weather.post('/getweathertabular', status_code=200)
async def get_weathertrend(details:Getweather,db:Session=Depends(get_db)):
    try:
        query="SELECT data_date,"+details.parameter+"::FLOAT FROM tbl_weather WHERE data_date BETWEEN '"+details.start_date+"' AND '"+details.end_date+"' AND district='"+details.district+"' AND mandal='"+details.mandal+"'"
        data=db.execute(query)
        results = [list(row) for row in data]
        return{
            'code':200,
            'trend':results
        }
    except:
        return{
            "message":"Error occured please provide valid parameters"
        }
@weather.get('/weatherparameter',status_code=200)
async def get_weather_parameter():
    return{
        'code':200,
        'parameters':[
            {
                'parameter':'rain',
                'unit':'mm'
            },
            {
                'parameter':'min_temp',
                'unit':'°C'
            },
            {
                'parameter':'max_temp',
                'unit':'°C'
            },
            {
                'parameter':'min_humidity',
                'unit':'%'
            },
            {
                'parameter':'max_humidity',
                'unit':'%'
            },
            {
                'parameter':'min_wind_speed',
                'unit':'kmph'
            },
            {
                'parameter':'max_wind_speed',
                'unit':'kmph'
            },
            
        ]
    }
    