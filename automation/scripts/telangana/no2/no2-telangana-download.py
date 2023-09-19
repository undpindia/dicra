import ee
import geemap
import os
import json
from datetime import date, datetime, timedelta

#Every file type and state base folder should be set in the beginning of the program
statebase = '/nfsdata/no2/telangana'
scriptbase= statebase + '/download'
basepath=  '/nfsdata/base_shapefiles'
tifspath = scriptbase + '/GEE_NO2tifs'

today = date.today() 
date_tdy = today.strftime('%Y-%m-%d')
print(date_tdy)

#Take 1 month previous date from today, because the EE data is not realtime
#first = today.replace(day=1)

last_month = (today - timedelta(days=today.day)).replace(day=1)
date_lmonth = last_month.strftime('%Y-%m-%d')
print(date_lmonth)

##:TODO: Check if the data for this date exists in the downloads folder , if yes skip the download

ee.Initialize() # Initialize

#Append state's boundary data address
#f=  open('../../../../../src/data_preprocessing/base_geojson/TL_state_shapefile_for_clip.geojson')
#Enter path of the config files, always prefix the scriptbase path to avoid referring wrong folders
f=  open(basepath+'/tl_state_boundary.geojson')
data =json.load(f)

data = data['features'][0]['geometry']['coordinates'][0]
roi = ee.Geometry.Polygon(data)
collection_subset = ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_NO2") \
    .sort('IMAGE_DATE').select('NO2_column_number_density') \
    .filterDate(date_lmonth,date_tdy) # Only select images for the years 2016-2019
print(collection_subset.size().getInfo()) # Shows the number of images within the subcollection
image = collection_subset.first().select('NO2_column_number_density')  # Pick the first image from the 'list' and select the layer of interest
geemap.image_props(image).getInfo() # Finds basic info of this image


#if tifspath not in os.listdir():
#    os.mkdir(tifspath)
#else:
#    print('GEE_NO2tifs directory exists')

#out = os.path.join('GEE_NO2tifs') # Set path to where we want to save the GeoTIF
out = os.path.join(tifspath) # Set path to where we want to save the GeoTIF
# Now export each image within the collection to a GeoTIF
geemap.ee_export_image_collection(collection_subset, out_dir = out, scale=image.select('NO2_column_number_density').projection().nominalScale(), region=roi, file_per_band=True, crs='EPSG:4326')

# image.select('NO2').projection().nominalScale() sets the scale equal to the resolution of the images within the collection
# file_per_band=False: all bands are downloaded and put as one file
# file_per_band=True: each band is downloaded in a single image
