from tkinter import W
from fastapi import APIRouter, Depends, FastAPI
import json
import psycopg2
from schemas.index import GetMarketDateRange
from datetime import datetime
import time
from boto3.session import Session
from db.database import get_db
from sqlalchemy import func
from sqlalchemy.sql import text
from models.index import Warehouse
from geoalchemy2 import Geometry
from datetime import date, timedelta, datetime

warehouse = APIRouter()
@warehouse.get('/warehouses', status_code=200)
def get_warehouses(db:Session=Depends(get_db)):
    data = []
    warehouse_result = db.query(
        Warehouse.capacity,
        Warehouse.district,
        Warehouse.latitude,
        Warehouse.longitude,
        Warehouse.occupancy,
        Warehouse.region,
        Warehouse.status,
        Warehouse.vacancy,
        Warehouse.warehouse,
        Warehouse.wh_type
    ).all()
    db.close()
    for row in warehouse_result:
        property = {"capacity": row[0], "district": row[1], "latitude": row[2], \
                  "longitude": row[3], "occupancy": row[4],"region":row[5], \
                  "status":row[6],"vacancy":row[7],"warehouse":row[8],"wh_type":row[9]}
        data.append(property)
    geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(d["longitude"]), float(d["latitude"])],
                },
                "properties": d,
            } for d in data]
    }
    return{
        'code':200,
        'data':geojson
    }
