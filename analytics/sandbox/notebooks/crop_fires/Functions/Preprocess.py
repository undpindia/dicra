import pandas as pd
import os
import geopandas as gpd
import geoplot
import geoplot.crs as gcrs
import rasterio
import matplotlib.pyplot as plt
import time
from rasterstats import zonal_stats
from osgeo import gdal
import numpy as np


import warnings
warnings.filterwarnings('ignore')


# This function rescales the pixel value such that we derive the physical values
def del_rescale(j, nodata_value_new, file_path):
    tiff_open = gdal.Open(file_path) # open the GeoTIFF we want to rescale
    band = tiff_open.GetRasterBand(1) # Select the band
    tiff_array = tiff_open.ReadAsArray() # Assign raster values to a numpy nd array

    nodata_value_old = 255
    nodata_value_old_2 = tiff_open.GetRasterBand(1).GetNoDataValue()

    tiff_array_new = np.where(tiff_array != nodata_value_old, tiff_array, nodata_value_new) # Rescale pixel values and change nodatavalue to -9999
    tiff_array_new = np.where(tiff_array_new != nodata_value_old_2, tiff_array_new, nodata_value_new)

    col = tiff_open.RasterXSize # number of columns
    rows = tiff_open.RasterYSize # number of rows
    driver = tiff_open.GetDriver()

    # Create a new raster to save the average-values
    new_raster = driver.Create(j, col, rows, 1, gdal.GDT_Float32)

    # Copy the properties of the original raster
    new_raster.SetGeoTransform(tiff_open.GetGeoTransform())
    new_raster.SetProjection(tiff_open.GetProjection())

    # Add the average values to newly created raster
    new_raster.GetRasterBand(1).WriteArray(tiff_array_new)
    new_raster.GetRasterBand(1).SetNoDataValue(nodata_value_new)

    # close the raster
    new_raster = None
    del new_raster

# This function rescales the pixel value such that we derive the physical values
def rescale(j, nodata_value_new, Scaling, Offset, file_path):
    tiff_open = gdal.Open(file_path) # open the GeoTIFF we want to rescale
    band = tiff_open.GetRasterBand(1) # Select the band
    tiff_array = tiff_open.ReadAsArray() # Assign raster values to a numpy nd array

    nodata_value_old = tiff_open.GetRasterBand(1).GetNoDataValue() # value which has been assigned for the nodata
    tiff_array_new = np.where(tiff_array != nodata_value_old, tiff_array * Scaling + Offset, nodata_value_new) # Rescale pixel values and change nodatavalue to -9999

    col = tiff_open.RasterXSize # number of columns
    rows = tiff_open.RasterYSize # number of rows
    driver = tiff_open.GetDriver()

    # Create a new raster to save the average-values
    new_raster = driver.Create(j, col, rows, 1, gdal.GDT_Float32)

    # Copy the properties of the original raster
    new_raster.SetGeoTransform(tiff_open.GetGeoTransform())
    new_raster.SetProjection(tiff_open.GetProjection())

    # Add the average values to newly created raster
    new_raster.GetRasterBand(1).WriteArray(tiff_array_new)
    new_raster.GetRasterBand(1).SetNoDataValue(nodata_value_new)

    # close the raster
    new_raster = None
    del new_raster

def crop_image(boundary):
    file_names = os.listdir("c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\Preprocessing_Data_Dicra\\Output")
    for i in file_names:
        file_name = "c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\Preprocessing_Data_Dicra\\Output\\" + i
        with rasterio.open(file_name) as src:
            out_image, out_transform = rasterio.mask.mask(src, boundary.geometry, crop=True)
            out_meta = src.meta
        
        out_meta.update({"driver": "GTiff",
                    "height": out_image.shape[1],
                    "width": out_image.shape[2],
                    "transform": out_transform})

        # Save the Geotiff file to Burnt Area in Telangana
        with rasterio.open("c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\Preprocessing_Data_Dicra\\Output\\" + i, "w", **out_meta) as dest:
            dest.write(out_image)
        print(i)

#Stat can be PM2.5 (Particular Matter), SSM (Soil mMisture), ST (Soil Temperature), NO2 (Nitrogren Dioxide)
def read_tiffs(boundaries, stat:str, loc_month_begin:int, loc_month_end:int, loc_year_begin:int, loc_year_end:int):

    columns =['index', 'Mandal_Nam', 'Dist_Name', 'geometry']

    stat_df = boundaries[columns]
    stat_df.head()

    files = os.listdir('c:\\Users\\Jesse\\OneDrive\\Documenten\\Data_Thesis\\'+ stat)
 
    for j in files:
        
        os.chdir('c:\\Users\\Jesse\\OneDrive\\Documenten\\Data_Thesis\\'+ stat)
        file = rasterio.open(j, mode = 'r')
        file_array = file.read(1) 
        affine = file.transform

        time = j[loc_year_begin:loc_year_end] + '-' + j[loc_month_begin:loc_month_end] + '-01'

        stat_df[time] = 0
        
        stat_mean = zonal_stats(boundaries.geometry, file_array, affine = affine, geojson_out = True, nodata = file.nodata, all_touched = True)
        
        stat_lst = []
        for a in range(0, len(boundaries)):
            stat_lst.append(stat_mean[a]['properties']['mean'])

        stat_df[time] = stat_lst

        os.chdir('c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\Data_csv\\results_csv')
        stat_df.to_csv(stat+'.csv')

    return(stat_df)