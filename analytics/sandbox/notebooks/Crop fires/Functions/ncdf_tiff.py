import os
import geopandas as gpd
import numpy as np
from osgeo import gdal
import rasterio
import rasterio.mask
import netCDF4 as nc

import warnings
warnings.filterwarnings('ignore')

def netcdf_to_tiff(parameter):
    folder_names = os.listdir('C:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\Preprocessing_Data_Dicra\\Input\\')
    for i in folder_names:
        file_names = os.listdir('C:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\Preprocessing_Data_Dicra\\Input\\' + i)
        for j in file_names:
            nc_data = "C:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\Preprocessing_Data_Dicra\\Input\\" + i + "\\" + j
            nc_file = gdal.Open('NETCDF:'+ nc_data + parameter)
            # Convert the netCDF to Geotiff file
            tiff_file = gdal.Translate('C:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\Preprocessing_Data_Dicra\\Output\\'+ j[:-3] + '.tif', nc_file)



