import json
import configparser
from fastapi import APIRouter
from app.schemas.index import Customdistrict
from shapely.geometry import shape, GeometryCollection, Point
from app.utils.util import getcentroid,toUnix,checknodata
from app.config.config import settings

customdistrictRouter=APIRouter()

@customdistrictRouter.post('/getdistrictname', status_code=200)
async def get_pointdistrict(details:Customdistrict):
    with open(settings.DISTRICT_BOUNDARY_PATH, 'r') as f:
        js = json.load(f)
    f.close()
    center_p=getcentroid(details.geojson)
    print(center_p)
    for feature in js['features']:
        polygon = shape(feature['geometry'])
        if polygon.contains(center_p):
            districtname=feature['properties']['Dist_Name']
            return{
                "Code":200,
                "District":districtname
            }
    return{
        "Code":404,
        "Message":"Please Draw the shape Completely Inside Telangana"
    }

