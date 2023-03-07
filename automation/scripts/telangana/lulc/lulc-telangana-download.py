import ee
import json
from osgeo import gdal
import geemap
import os
import json

import time
import subprocess as subp

from osgeo import gdal, gdal_array
from datetime import datetime, timedelta

ee.Initialize() # Initialize

statebase = '/nfsdata/lulc/telangana'
scriptbase= statebase + '/download'
basepath= statebase + '/base'

year = 2017
f=  open(basepath+'/Telangana_state_shapefile_for_clip.geojson')
data =json.load(f)

data = data['features'][0]['geometry']['coordinates'][0]
roi = ee.Geometry.Polygon(data)

features = geemap.fishnet(roi, rows=2, cols=2)
#features = ee.FeatureCollection([roi])

MyImage  = ee.ImageCollection("projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS") \
                    .filterBounds(roi).filterDate(str(year)+'-01-01',str(year+1)+'-01-01') \
                    .mean().clip(roi)

geemap.download_ee_image_tiles(
    MyImage, features, "LULC_"+str(year), prefix="LULC_", crs="EPSG:4326", scale=10,
)