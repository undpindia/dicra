# Import packages
import ee
import geemap
import os
import json

import time
import subprocess as subp

from osgeo import gdal, gdal_array
from datetime import datetime, timedelta

date_tdy = datetime.today() 
date_tdy = date_tdy.strftime('%Y-%m-%d')
print(date_tdy)

ee.Initialize() # Initialize

f=  open('base_geojson/TL_state_shapefile_for_clip.geojson')
data =json.load(f)

data = data['features'][0]['geometry']['coordinates'][0]
roi = ee.Geometry.Polygon(data)

collection_subset = ee.ImageCollection("NASA_USDA/HSL/SMAP10KM_soil_moisture") \
    .sort('IMAGE_DATE').select('ssm') \
    .filterDate('2019-09-17',str(date_tdy)) # Only select images for the years 2016-present
print(collection_subset.size().getInfo()) # Shows the number of images within the subcollection

image = collection_subset.first().select('ssm')  # Pick the first image from the 'list' and select the layer of interest
geemap.image_props(image).getInfo() # Finds basic info of this image

out = os.path.join('GEE_SSMtifs') # Set path to where we want to save the GeoTIF
# Now export each image within the collection to a GeoTIF
geemap.ee_export_image_collection(collection_subset, out_dir = out, scale=image.select('ssm').projection().nominalScale(), region=roi, file_per_band=True, crs='EPSG:4326')

# image.select('NDVI').projection().nominalScale() sets the scale equal to the resolution of the images within the collection
# file_per_band=False: all bands are downloaded and put as one file
# file_per_band=True: each band is downloaded in a single image


basepath='GEE_SSMtifs/'

if 'projected' not in os.listdir():
    os.mkdir('projected')
else:
    print('directory exists')

arr = os.listdir('GEE_SSMtifs')
for i in arr:
    cmd="gdalwarp -of GTIFF  -r cubic -t_srs '+proj=longlat +datum=WGS84 +no_defs'"+" "+basepath+str(i)+" projected/"+str(i)
    print(cmd)
    try:
        subp.check_call(str(cmd), shell=True)
    except:
        print("end")
    time.sleep(1)

# Open band 1 as array
arr = os.listdir('projected/')


if 'clipped' not in os.listdir():
    os.mkdir('clipped')
else:
    print('directory exists')
    
for i in arr:
    cmd="gdalwarp -dstnodata -9999 -cutline tsdm/District_Boundary.shp -crop_to_cutline "+basepath+str(i)+" clipped/"+i
    print(cmd)
    try:
        subp.check_call(str(cmd), shell=True)
    except:
        print("end")
    time.sleep(1)

arr = os.listdir('clipped/')

if 'cog' not in os.listdir():
    os.mkdir('cog')
else:
    print('directory exists')

for i in arr:
    cmd="gdal_translate clipped/"+str(i)+" cog/"+str(i)+" -co COMPRESS=LZW -co TILED=YES"
    print(cmd)
    try:
        subp.check_call(str(cmd), shell=True)
    except:
        print("end")
    time.sleep(1)

cmd="rm -r GEE_SSMtifs clipped projected recalculated"
print(cmd)
try:
    subp.check_call(str(cmd), shell=True)
except:
    print("end")
