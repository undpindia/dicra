from fastapi import APIRouter, Depends, FastAPI
import json
import psycopg2
from schemas.index import GetMarketDateRange,GetMarketCommTrend
from datetime import datetime
import time
from boto3.session import Session
from db.database import get_db
from sqlalchemy import func
from sqlalchemy.sql import text
from models.index import Market_point, Market_data
from geoalchemy2 import Geometry
from datetime import date, timedelta, datetime

market=APIRouter()

@market.get('/getmarketyard', status_code=200)
def get_market_yard(db:Session=Depends(get_db)):
    data = []
    market_result = db.query(Market_point.district, Market_point.capacity, Market_point.name,
                   Market_point.latitude, Market_point.longitude).all()
    db.close()
    for row in market_result:
        result = {"district": row[0], "capacity": row[1], "name": row[2], \
                  "latitude": float(row[3]), "longitude": float(row[4])}
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
    if len(data) == 0:
        return {'code': 404,
                'message': "No data available for the given date range"}
    else:
        return {
            'code':200,
            'data':geojson
        }

@market.post('/getmarketyarddaterange', status_code=200)
def get_market_yard_details(param:GetMarketDateRange, db:Session=Depends(get_db)):
    try:
        result = db.execute(text("""SELECT "DDate", "AmcCode", "AmcName", "YardCode", "YardName", "CommCode", "CommName", "VarityCode",\
                        "VarityName", "ProgArrivals", "Arrivals", "Minimum", "Maximum", "Model", "Valuation", "MarketFee" \
                        FROM tbl_market_yard_day_prices WHERE "DDate" BETWEEN '"""+param.startdate+"""'  AND '"""+param.enddate+"""'\
                         AND "YardName" ='"""+param.name+"""' """)).fetchall()
        db.close()
        if result == []:
            return {
                "code":200,
                "message": "Data Not found"}
        else:
            return {"code": 200, "details" : result}
    except:
        return {
            "message": "start date and end date in should be YYYY-MM-DD"
        }
@market.get('/getcommodityname', status_code=200)
def commodity(marketname:str,db:Session=Depends(get_db)):
    comm_names = []
    comm_query = db.execute("""SELECT  DISTINCT "CommName" FROM public.tbl_market_yard_day_prices WHERE LOWER("YardName")='"""+marketname.lower()+"""'  ORDER BY "CommName" ASC """).fetchall()
    db.close()
    for i in comm_query:
        comm_names.append(i[0])
    if comm_names:
        return {"code": 200, "commodity_names": comm_names}
    else:
        return {"code": 404, "commodity_names": comm_names}
    
@market.get('/getvarietyname', status_code=200)
def get_varity_name(commodity:str,marketname:str, db:Session=Depends(get_db)):
    var_names = []
    query = db.execute("""SELECT  DISTINCT "VarityName" FROM public.tbl_market_yard_day_prices
                          WHERE "CommName"='"""+commodity+"""' AND LOWER("YardName")='"""+marketname.lower()+"""' ORDER BY "VarityName" ASC """).fetchall()
    db.close()
    for i in query:
        var_names.append([i[0]])
    return {"code": 200, "varity_name": var_names}

@market.post('/getmarketyardtrend', status_code=200)
def get_trend(details:GetMarketCommTrend, db:Session=Depends(get_db)):
    market_trend = []
    sql = db.execute("""SELECT  EXTRACT(EPOCH FROM TO_DATE("DDate", 'YYYY-MM-DD'))*1000 as Unix, "Arrivals", "Minimum", "Maximum"
                              FROM public.tbl_market_yard_day_prices
                              WHERE "DDate" BETWEEN '"""+details.startdate+"""'  AND '"""+details.enddate+"""'
							  AND LOWER("YardName") ='"""+details.name.lower()+"""' AND LOWER("CommName") ='"""+details.commodity.lower()+"""'
							  AND LOWER("VarityName") = '"""+details.varity.lower()+"""'
							  GROUP BY Unix, "Arrivals", "Minimum", "Maximum" ;""").fetchall()
    db.close()

    if details.parameter == "Arrivals":
        for row in sql:
            unix = row[0]
            arrivals = row[1]
            market_trend.append([unix, arrivals])
        return {'code': 200, 'trend': market_trend}
    elif details.parameter == "Minimum":
        for row in sql:
            unix = row[0]
            min = row[2]
            market_trend.append([unix, min])
        return {'code': 200, 'trend': market_trend}
    elif details.parameter == "Maximum":
        for row in sql:
            unix = row[0]
            max = row[3]
            market_trend.append([unix, max])
        return {'code': 200, 'trend': market_trend}
    elif sql == []:
        return {
            'code': 404,
            "message": "Selected name or commodity not found"}
    else:
        return {'code': 404,
                'message': "Selected parameter not found"}