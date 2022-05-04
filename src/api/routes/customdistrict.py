import json
import configparser
from fastapi import APIRouter
from schemas.index import Customdistrict
from shapely.geometry import shape, GeometryCollection, Point

config = configparser.ConfigParser()
config.read('config/config.ini')
district_boundary=config['boundaries']['Districtboundary']

customdistrict=APIRouter()
def getcentroid(polygon_feature):
    """
    Function for getting centroid of a polygon feature
    Parameters
    polygon_feature - Polygon feture object from the geojson
    """
    polygon_shape=shape(polygon_feature)
    centrod_of_polygon=polygon_shape.centroid
    return(centrod_of_polygon)

@customdistrict.post('/getdistrictname', status_code=200)
async def get_pointdistrict(details:Customdistrict):
    with open(district_boundary, 'r') as f:
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


    