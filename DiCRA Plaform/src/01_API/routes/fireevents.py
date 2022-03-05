import time
import json
import psycopg2
from sqlalchemy import func
from fastapi import FastAPI
from datetime import datetime
from db.database import get_db
from sqlalchemy.orm import Session
from models.index import Firepoints
from fastapi import APIRouter,Depends
from schemas.index import GetPoint, GetPointDateRange

points=APIRouter()

@points.post('/getpoints', status_code=200)
def get_points(details:GetPoint,db: Session = Depends(get_db)):
    points_list = []
    geom = json.dumps(details.geojson)                  
    res = db.query(Firepoints.brightness, Firepoints.scan, Firepoints.track, Firepoints.acq_date, Firepoints.acq_time,
                        Firepoints.satellite, Firepoints.instrument, Firepoints.confidence, Firepoints.version,
                        Firepoints.bright_t31, Firepoints.frp, Firepoints.daynight, func.ST_AsText(Firepoints.geometry),
                        func.ST_X(Firepoints.geometry), func.ST_Y(Firepoints.geometry)).filter(func.ST_Within(Firepoints.geometry,
                        func.ST_GeomFromGeoJSON(geom)),Firepoints.acq_date.between(details.startdate, details.enddate)).all()
    for row in res:
        details = {"brightness": row[0], "scan": row[1], "track": row[2], \
                   "acq_date": row[3], "acq_time": row[4], "satellite": row[5], \
                   "instrument": row[6], "confidence": row[7], "version": row[8], \
                   "bright_t31": row[9], "frp": row[10], "daynight": row[11], \
                   "geometry": row[12]}
        points_list.append(details)
    db.close()
    if len(points_list) == 0:
        return {'code': 404,
                'message': "No data available for the given date range"}
    else:
        return {'code':200, 'properties':points_list},{"count": len(points_list)}

@points.post('/getpointstrend', status_code=200)
def get_trend(details:GetPoint,db: Session = Depends(get_db)):
    points_trend = []
    geom = json.dumps(details.geojson)
    sql = '''SELECT  EXTRACT(EPOCH FROM TO_DATE(acq_date, 'YYYY-MM-DD')) as unix, COUNT(*) 
                    FROM public.tbl_points
                    WHERE ST_Within(geometry, ST_GeomFromGeoJSON(' '''+geom+''' ')) AND acq_date BETWEEN ' ''' +details.startdate+''' ' AND ' '''+details.enddate+''' ' GROUP BY unix;'''
                    
    res = db.execute(sql).fetchall()
    for row in res:
        points_trend.append([row[0]*1000,row[1]])
    db.close()
    if len(points_trend) == 0:
        return {'code': 404,
                'message': "No data available for the given date range"}
    else:
        return {'code':200, 'trend':points_trend}

@points.post('/getpointsindaterange', status_code=200)
def get_fire_events_in_date_range(details:GetPointDateRange,db: Session = Depends(get_db)):
    data = []
    format = "%Y-%m-%d"
    try:
        datetime.strptime(details.startdate, format)
        datetime.strptime(details.enddate, format)
    except ValueError:
        return {
            "message": "start date and end date in should be YYYY-MM-DD"
        }
    res = db.query(Firepoints.brightness, Firepoints.scan, Firepoints.track, Firepoints.acq_date, Firepoints.acq_time,
                        Firepoints.satellite, Firepoints.instrument, Firepoints.confidence, Firepoints.version,
                        Firepoints.bright_t31, Firepoints.frp, Firepoints.daynight, func.ST_AsText(Firepoints.geometry),
                        func.ST_X(Firepoints.geometry), func.ST_Y(Firepoints.geometry)).filter(Firepoints.acq_date.between(details.startdate, details.enddate)).all()
    
    for row in res:
        result = {"brightness": row[0], "scan": row[1], "track": row[2], \
                  "acq_date": row[3], "acq_time": row[4], "satellite": row[5], \
                  "instrument": row[6], "confidence": row[7], "version": row[8], \
                  "bright_t31": row[9], "frp": row[10], "daynight": row[11], \
                  "latitude": row[14], "longitude": row[13]}
        data.append(result)
    geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [d["longitude"], d["latitude"]],
                },
                "properties": d,
            } for d in data]
    }
    db.close()
    if len(data) == 0:
        return {'code': 404,
                'message': "No data available for the given date range"}
    else:
        return geojson