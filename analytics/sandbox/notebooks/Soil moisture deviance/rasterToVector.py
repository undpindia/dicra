import json
import configparser
from pprint import pprint
from shapely.geometry import shape
from rasterstats import zonal_stats,point_query
#from s3_file_management import writeJson
import os

#config = configparser.ConfigParser()
#config.read('config/config.ini')

#aws_access_key = config['AWS']['AccessKey']
#aws_secret_key = config['AWS']['SecretAccessKey']
#aws_bucket = config['s3bucket']['BucketName']

def getcentroid(polygon_feature):
    """
    Function for getting centroid of a polygon feature
    Parameters
    polygon_feature - Polygon feture object from the geojson
    """
    polygon_shape=shape(polygon_feature)
    centrod_of_polygon=polygon_shape.centroid
    return(centrod_of_polygon)

def createstat(point_value):
    """
    Function for creating stat object 
    Parameters
    point_value - Value extracted from the centroid of the polygon
    """
    if(point_value[0] is None):
        return({'count':1,
        'min':'N/A','mean':'N/A',
        'max':'N/A','median':'N/A'})
    else:
        return({'count':0,
        'min':point_value[0],'mean':point_value[0],
        'max':point_value[0],'median':point_value[0]})

def createvector(geojson_path,tif_path,s3file_name):
    """
    Function for generating vector data based on raster
    Parameters
    geojson_path - Path of the geojson file 
    tif_path - Path of the tif file
    s3file_name - Name of the json file we need to store in s3 bucket
    """
    
    # Open geojson file for zonal statistics calculation
    with open(str(geojson_path)) as f:
        data = json.load(f)
    f.close()
    
    for i in data['features']:
        # Calculating zonal statistics for the given geojson feature
        stat=zonal_stats(i['geometry'], str(tif_path),
            stats="count min mean max median")
        # Checking if zonal statistics is successfully calculated or not
        if(stat[0]['count']==0):
            i['properties']['zonalstat']=createstat(point_query(
                getcentroid(i['geometry']),tif_path))
        else:
            i['properties']['zonalstat']=stat[0]
    # writing vector layer as geojson onto s3 bucket
    # writeJson(aws_access_key,aws_secret_key,aws_bucket,data,s3file_name)
        with open(str(s3file_name), 'w') as f:
            json.dump(data, f)
        f.close()

arr = os.listdir('Soil Moisture Deviance/convert/data/')
for i in arr:
    without_ext=os.path.splitext(i)[0]
    print(without_ext)
    createvector('convert/geojson/TS_district_boundary.json', "Soil Moisture Deviance/convert/data/"+str(i), "Soil Moisture Deviance/convert/districts/"+str(without_ext)+'.geojson')