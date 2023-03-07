import matplotlib.pyplot as plt
from soilgrids import SoilGrids
import geopandas as gpd
import os
import subprocess as subp
import time
from osgeo import gdal, gdal_array

#Every file type and state base folder should be set in the beginning of the program
statebase = '/nfsdata/soc/jharkhand'
scriptbase= statebase + '/download'
basepath= statebase + '/base'
tifspath = scriptbase + '/SOCtifs'

geojson = basepath+'/Jharkhand_state_shapefile_for_clip.geojson'
gdf = gpd.read_file(geojson)
gdf = gdf.to_crs(3857) # because Soilgrid data is in EPSG:3857
bnd  = gdf.bounds #get corner points

os.mkdir(tifspath) #create directory to save file

# soc 
# get data from SoilGrids
soil_grids = SoilGrids()
data = soil_grids.get_coverage_data(service_id='soc', coverage_id='soc_0-5cm_mean', 
                                    #height=2000,width=2000,
                                       west=bnd.minx[0], south=bnd.miny[0], east=bnd.maxx[0], north=bnd.maxy[0],  
                                       crs='urn:ogc:def:crs:EPSG::3857',output=tifspath+'/soc_0-5cm_mean_telangana.tif')

# show metadata
for key, value in soil_grids.metadata.items():
    print('{}: {}'.format(key,value))


# clay
# get data from SoilGrids
soil_grids = SoilGrids()
data = soil_grids.get_coverage_data(service_id='clay', coverage_id='clay_0-5cm_mean', 
                                    #height=2000,width=2000,
                                       west=bnd.minx[0], south=bnd.miny[0], east=bnd.maxx[0], north=bnd.maxy[0],  
                                       crs='urn:ogc:def:crs:EPSG::3857',output=tifspath+'/clay_0-5cm_mean_telangana.tif')

# show metadata
for key, value in soil_grids.metadata.items():
    print('{}: {}'.format(key,value))


# bulk density
# get data from SoilGrids
soil_grids = SoilGrids()
data = soil_grids.get_coverage_data(service_id='bdod', coverage_id='bdod_0-5cm_mean', 
                                    #height=2000,width=2000,
                                       west=bnd.minx[0], south=bnd.miny[0], east=bnd.maxx[0], north=bnd.maxy[0],  
                                       crs='urn:ogc:def:crs:EPSG::3857',output=tifspath+'/bdod_0-5cm_mean_telangana.tif')

# show metadata
for key, value in soil_grids.metadata.items():
    print('{}: {}'.format(key,value))
