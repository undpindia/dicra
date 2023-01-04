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
import re


import warnings
warnings.filterwarnings('ignore')

 
# This function rescales the pixel value such that we derive the physical values
def del_rescale(j, nodata_value_new, file_path, nodata_value_old):
    tiff_open = gdal.Open(file_path) # open the GeoTIFF we want to rescale
    band = tiff_open.GetRasterBand(1) # Select the band
    tiff_array = tiff_open.ReadAsArray() # Assign raster values to a numpy nd array

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
    return tiff_array_new

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
    return tiff_array_new

def crop_image(boundary): 
    maps = os.listdir("c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\Preprocessing_Data_Dicra\\Output\\")
    for i in maps:
        os.chdir("c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\Preprocessing_Data_Dicra\\Output\\")
 
        with rasterio.open(i) as src:
            out_image, out_transform = rasterio.mask.mask(src, boundary.geometry, crop=True)
            out_meta = src.meta
        
        out_meta.update({"driver": "GTiff",
                    "height": out_image.shape[1],
                    "width": out_image.shape[2],
                    "transform": out_transform})

        # Save the Geotiff file to Burnt Area in Telangana
        with rasterio.open("c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\Preprocessing_Data_Dicra\\Output\\" + i, "w", **out_meta) as dest:
            dest.write(out_image)


#Stat can be PM2.5 (Particular Matter), SSM (Soil mMisture), ST (Soil Temperature), NO2 (Nitrogren Dioxide)
def read_tiffs(boundaries, level:str, stat:str, loc_month_begin:int, loc_month_end:int, loc_year_begin:int, loc_year_end:int, all_touched:bool, statistic:str):

    if level == 'Mandal':
        columns =['index', 'Mandal_Nam', 'Dist_Name', 'geometry']
    elif level == 'District':
        columns =['index', 'Dist_Name', 'geometry']
    else:
        columns =['index', 'geometry']

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
        
        stat_mean = zonal_stats(boundaries.geometry, file_array, affine = affine, geojson_out = True, nodata = file.nodata, all_touched = all_touched, stats = [statistic])
        
        stat_lst = []
        for a in range(0, len(boundaries)):
            stat_lst.append(stat_mean[a]['properties'][statistic])

        stat_df[time] = stat_lst

    if level == 'Mandal':
        df_unpivot = pd.melt(stat_df, id_vars=['index', 'Mandal_Nam', 'Dist_Name', 'geometry'], value_vars=stat_df.columns)
        col_names = ['index', 'Mandal_Nam', 'Dist_Name', 'geometry', 'ModifiedDateTime', 'Value']
    elif level == 'District':
        df_unpivot = pd.melt(stat_df, id_vars=['index', 'Dist_Name', 'geometry'], value_vars=stat_df.columns)
        col_names = ['index', 'Dist_Name', 'geometry', 'ModifiedDateTime', 'Value']
    elif (level == '10_km') | (level == '1_km'):
        df_unpivot = pd.melt(stat_df, id_vars=['index', 'geometry'], value_vars=stat_df.columns)
        col_names = ['index','geometry', 'ModifiedDateTime', 'Value']
    
    df_unpivot.columns = col_names
    df_unpivot['ModifiedDateTime'] = pd.to_datetime(df_unpivot['ModifiedDateTime'])

    if stat=='BA_monthly':
        df_unpivot['Value'] = df_unpivot['Value'] * 0.09 #One pixel is equal to 300m by 300m also in total *0.09 km^2 burnt area in a mandal

    os.chdir('c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\Data_csv\\results_csv')
    df_unpivot.to_csv(stat+'_'+level+'_'+statistic+'.csv')

    return(df_unpivot)

def monthly_averages(folder_path, dest_path, beginyear, endyear):
    file_names = os.listdir(folder_path) # contains all filenames within the selected folder
    months = ['-01-', '-02-', '-03-', '-04-', '-05-', '-06-', '-07-', '-08-', '-09-', '-10-', '-11-', '-12-']
    for year in range(beginyear,endyear+1):
        for m in months:
            year_month = str(year) + m
            group = list(filter(lambda x: year_month in x, file_names))
            print(group)
            n = len(group) # number of images within group
            if n != 0: 
                images = []
                val_array = []
                bin_array = []

                for j in range(n):
                    images.append(gdal.Open(folder_path + group[j])) # Open each of the n images
                    val_array.append(images[j].GetRasterBand(1).ReadAsArray().flatten())  # Read each of the n images as an array
                    
                col = images[0].RasterXSize # number of columns
                rows = images[0].RasterYSize # number of rows
                driver = images[0].GetDriver()
                nodata_value = images[1].GetRasterBand(1).GetNoDataValue() # value which has been assigned for the nodata

                if nodata_value == None:
                    nodata_value = -9999
                    
                for k in range(n):
                    bin_array.append(np.where(val_array[k] == nodata_value, 1, 0)) # For each image, create binary array where value is 1 if nodata pixel, 0 otherwise
                sum_counts = sum(bin_array) # For each pixel, we count the number of nodata values
                numbers = n - sum_counts # number of times we have data values per pixel
                no_data = np.where(sum_counts == n, 1, 0) # 1 if no data available for particular pixel, 0 otherwise

                # If numbers is 0 for a particular pixel, then we do not have any data on that pixel
                numbers = np.where(numbers == 0, 1, numbers) # Set to 1 as we can not divide by 0

                val_sum = sum(val_array) # Sum all values
                avg = (val_sum - sum_counts * nodata_value + no_data * nodata_value) / numbers # Calculate the average-data
                avgdataMatrix= avg.reshape(rows,col)
                # Create a new raster to save the average-values
                #param = re.search('(.*)_', group[0]).group(1)
                raster_avg = driver.Create(dest_path + year_month[:-1] + ".tif", col, rows, 1, gdal.GDT_Float32)

                # Copy the properties of the original raster
                raster_avg.SetGeoTransform(images[0].GetGeoTransform())
                raster_avg.SetProjection(images[0].GetProjection())

                # Add the average values to newly created raster
                raster_avg.GetRasterBand(1).WriteArray(avgdataMatrix)
                raster_avg.GetRasterBand(1).SetNoDataValue(nodata_value)

                # Close raster
                raster_avg = None
                del raster_avg
