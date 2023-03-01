import ee
import geemap
import os
import json
from datetime import datetime, timedelta

date_tdy = datetime.today() 
date_tdy = date_tdy.strftime('%Y-%m-%d')
print(date_tdy)

ee.Initialize() # Initialize

f=  open('../../../../../src/data_preprocessing/base_geojson/TL_state_shapefile_for_clip.geojson')
data =json.load(f)

data = data['features'][0]['geometry']['coordinates'][0]
roi = ee.Geometry.Polygon(data)



date_tdy = datetime.today() 
date_tdy = date_tdy.strftime('%Y-%m-%d')
print(date_tdy)

ee.Initialize() # Initialize

#Append state's boundary data address
f=  open('../../../../../src/data_preprocessing/base_geojson/TL_state_shapefile_for_clip.geojson')
data =json.load(f)

data = data['features'][0]['geometry']['coordinates'][0]
roi = ee.Geometry.Polygon(data)
