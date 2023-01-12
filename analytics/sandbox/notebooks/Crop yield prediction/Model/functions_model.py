# Import packages
import numpy as np
import os
import pandas as pd
#from sklearn.metrics import mean_squared_error
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import export_graphviz
#import pydot
import matplotlib.pyplot as plt
import datetime
from sklearn import preprocessing
from sklearn.metrics import mean_absolute_error, accuracy_score, r2_score, mean_squared_error
import geopandas as gpd
import warnings
import shap
from sklearn.model_selection import RandomizedSearchCV
from sklearn.model_selection import GridSearchCV
import random
import math
import re
import rasterio
from rasterstats import zonal_stats
from osgeo import gdal

# This function is used for the Blocking Split Cross Validation
class BlockingTimeSeriesSplit():
    def __init__(self, n_splits):
        self.n_splits = n_splits
    
    def get_n_splits(self, X, y, groups):
        return self.n_splits
    
    def split(self, X, y=None, groups=None):
        n_samples = len(X)
        k_fold_size = n_samples // self.n_splits
        #print(k_fold_size)
        indices = np.arange(n_samples)

        margin = 0
        for i in range(self.n_splits):
            start = i * k_fold_size
            stop = start + k_fold_size
            mid = int(0.5 * (stop - start)) + start
            yield indices[start: mid], indices[mid + margin: stop]

# This function returns all possible subsets of a list
def subsets (l):
    subset_list = []
    for i in range(len(l) + 1):
        for j in range(i):
            subset_list.append(l[j: i])
    return subset_list

# This function creates a dataframe to evaluate the movement within a certain parameter
def dataframe_observations(geodataframe, parameter, path, statistic, method):
    # action = True/False
    gdf = geodataframe.copy()
    year = geodataframe['Year'].unique()[0] # Year

    year_month = [str(year-1) + '-06', str(year-1) + '-07', str(year-1) + '-08', str(year-1) + '-09', str(year-1) + '-10', str(year-1) + '-11', str(year-1) + '-12', str(year) + '-01', str(year) + '-02', str(year) + '-03', str(year) + '-04', str(year) + '-05', str(year) + '-06', str(year) + '-07', str(year) + '-08', str(year) + '-09', str(year) + '-10', str(year) + '-11', str(year) + '-12']

    files = os.listdir(path)
    file_names = []
    for i in range(len(year_month)):
        group = list(filter(lambda x: year_month[i] in x, files))
        file_names.append(group)
    file_names = sum(file_names, [])

    for f in file_names:
        date = re.search('.*\_(.*?)\..*', f).group(1)[5:]
        file_path = path + f
        param = rasterio.open(file_path, mode = 'r')
        # Assign raster values to a numpy nd array
        param_array = param.read(1) # landuse corresponding to each rasterpixel, so we extracted the pixel values from the raster    
        # NOTE: stats must be any of these ['count', 'min', 'max', 'mean', 'sum', 'std', 'median', 'majority', 'minority', 'unique', 'range', 'nodata', 'nan']
        zonal_stat = zonal_stats(geodataframe.geometry, param_array, affine = param.transform, geojson_out = True, nodata = param.nodata, all_touched = method, stats = statistic)
        
        # Extracting the statistics from the list
        for j in range(len(statistic)):
            gdf[parameter + '_' + date + '_' + statistic[j]] = np.nan
            indx = list(gdf.columns).index(parameter + '_' + date + '_' + statistic[j])
            for i in range(np.size(geodataframe,0)):
                gdf.iloc[i,indx] = zonal_stat[i]['properties'][statistic[j]]

    return gdf

# This function creates GeoTIFFs representing the monthly averages 
# NOTE: Files are in format as YYYY-MM-DD
def monthly_averages(folder_path, dest_path, beginyear, endyear):
    file_names = os.listdir(folder_path) # contains all filenames within the selected folder
    months = ['-01-', '-02-', '-03-', '-04-', '-05-', '-06-', '-07-', '-08-', '-09-', '-10-', '-11-', '-12-']
    for year in range(beginyear,endyear+1):
        for m in months:
            year_month = str(year) + m
            group = list(filter(lambda x: year_month in x, file_names))
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
                nodata_value = images[0].GetRasterBand(1).GetNoDataValue() # value which has been assigned for the nodata
                
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
                param = re.search('(.*)_', group[0]).group(1)
                raster_avg = driver.Create(dest_path + param + '_' + year_month[:-1] + ".tif", col, rows, 1, gdal.GDT_Float32)

                # Copy the properties of the original raster
                raster_avg.SetGeoTransform(images[0].GetGeoTransform())
                raster_avg.SetProjection(images[0].GetProjection())

                # Add the average values to newly created raster
                raster_avg.GetRasterBand(1).WriteArray(avgdataMatrix)
                raster_avg.GetRasterBand(1).SetNoDataValue(nodata_value)

                # Close raster
                raster_avg = None
                del raster_avg

# This function creates GeoTIFFs representing the monthly averages 
# NOTE: Files are in format as YYYY-MM-DD
def monthly_accumulates(folder_path, dest_path, beginyear, endyear):
    file_names = os.listdir(folder_path) # contains all filenames within the selected folder
    months = ['-01-', '-02-', '-03-', '-04-', '-05-', '-06-', '-07-', '-08-', '-09-', '-10-', '-11-', '-12-']
    for year in range(beginyear,endyear+1):
        for m in months:
            year_month = str(year) + m
            group = list(filter(lambda x: year_month in x, file_names))
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
                nodata_value = images[0].GetRasterBand(1).GetNoDataValue() # value which has been assigned for the nodata
                
                for k in range(n):
                    bin_array.append(np.where(val_array[k] == nodata_value, 1, 0)) # For each image, create binary array where value is 1 if nodata pixel, 0 otherwise

                sum_counts = sum(bin_array) # For each pixel, we count the number of nodata values
                numbers = n - sum_counts # number of times we have data values per pixel
                no_data = np.where(sum_counts == n, 1, 0) # 1 if no data available for particular pixel, 0 otherwise

                # If numbers is 0 for a particular pixel, then we do not have any data on that pixel
                numbers = np.where(numbers == 0, 1, numbers) # Set to 1 as we can not divide by 0

                val_sum = sum(val_array) # Sum all values
                acc = (val_sum - sum_counts * nodata_value + no_data * nodata_value) # Calculate the average-data
                avgdataMatrix= acc.reshape(rows,col)

                # Create a new raster to save the average-values
                param = re.search('(.*)_', group[0]).group(1)
                raster_acc = driver.Create(dest_path + param + '_' + year_month[:-1] + ".tif", col, rows, 1, gdal.GDT_Float32)

                # Copy the properties of the original raster
                raster_acc.SetGeoTransform(images[0].GetGeoTransform())
                raster_acc.SetProjection(images[0].GetProjection())

                # Add the average values to newly created raster
                raster_acc.GetRasterBand(1).WriteArray(avgdataMatrix)
                raster_acc.GetRasterBand(1).SetNoDataValue(nodata_value)

                # Close raster
                raster_acc = None
                del raster_acc

def time_observations(geodataframe, parameter, path, statistic, method):
    # action = True/False
    gdf = geodataframe.copy()
    year = geodataframe['Year'].unique()[0] # Year
    season = geodataframe['Season'].unique()[0].lower() # Season

    if season == 'kharif':
        # kharif prediction
        year_month = [str(year) + '-05', str(year) + '-06', str(year) + '-07', str(year) + '-08', str(year) + '-09', str(year) + '-10', str(year) + '-11']        
    elif season == 'rabi':
        # rabi prediction
        year_month = [str(year-1) + '-09', str(year-1) + '-10', str(year-1) + '-11', str(year-1) + '-12', str(year) + '-01', str(year) + '-02', str(year) + '-03', str(year) + '-04', str(year) + '-05', str(year) + '-06']
    elif season == 'summer':
        # zaid prediction
        year_month = [str(year) + '-01', str(year) + '-02', str(year) + '-03', str(year) + '-04', str(year) + '-05', str(year) + '-06']  

    files = os.listdir(path)
    file_names = []
    for i in range(len(year_month)):
        group = list(filter(lambda x: year_month[i] in x, files))
        file_names.append(group)
    file_names = sum(file_names, [])

    for f in file_names:
        date = re.search('.*\-(.*?)\..*', f).group(1)
        file_path = path + f
        param = rasterio.open(file_path, mode = 'r')
        # Assign raster values to a numpy nd array
        param_array = param.read(1) # landuse corresponding to each rasterpixel, so we extracted the pixel values from the raster    
        # NOTE: stats must be any of these ['count', 'min', 'max', 'mean', 'sum', 'std', 'median', 'majority', 'minority', 'unique', 'range', 'nodata', 'nan']
        zonal_stat = zonal_stats(geodataframe.geometry, param_array, affine = param.transform, geojson_out = True, nodata = param.nodata, all_touched = method, stats = statistic)
        
        # Extracting the statistics from the list
        for j in range(len(statistic)):
            gdf[parameter + '_' + date + '_' + statistic[j]] = np.nan
            indx = list(gdf.columns).index(parameter + '_' + date + '_' + statistic[j])
            for i in range(np.size(geodataframe,0)):
                gdf.iloc[i,indx] = zonal_stat[i]['properties'][statistic[j]]

    return gdf

def time_observations_day(geodataframe, parameter, path, statistic, method):
    # action = True/False
    gdf = geodataframe.copy()
    year = geodataframe['Year'].unique()[0] # Year
    season = geodataframe['Season'].unique()[0].lower() # Season

    if season == 'kharif':
        # kharif prediction
        year_month = [str(year) + '-05', str(year) + '-06', str(year) + '-07', str(year) + '-08', str(year) + '-09', str(year) + '-10', str(year) + '-11']        
    elif season == 'rabi':
        # rabi prediction
        year_month = [str(year-1) + '-09', str(year-1) + '-10', str(year-1) + '-11', str(year-1) + '-12', str(year) + '-01', str(year) + '-02', str(year) + '-03', str(year) + '-04', str(year) + '-05', str(year) + '-06']
    elif season == 'summer':
        # zaid prediction
        year_month = [str(year) + '-01', str(year) + '-02', str(year) + '-03', str(year) + '-04', str(year) + '-05', str(year) + '-06']  

    files = os.listdir(path)
    file_names = []
    for i in range(len(year_month)):
        group = list(filter(lambda x: year_month[i] in x, files))
        file_names.append(group)
    file_names = sum(file_names, [])

    for f in file_names:
        if parameter == 'Precipitation':
            date = re.search('.*\_(.*?)\..*', f).group(1)[5:]
        elif parameter == 'SSM':
            date = re.search('.*\_(.*?)\..*', f).group(1)[5:]
        elif parameter == 'SUSM':
            date = re.search('.*\_(.*?)\..*', f).group(1)[5:]            
        else:
            date = re.search('.*\-(.*?)\..*', f).group(1)
        file_path = path + f
        param = rasterio.open(file_path, mode = 'r')
        # Assign raster values to a numpy nd array
        param_array = param.read(1) # landuse corresponding to each rasterpixel, so we extracted the pixel values from the raster    
        # NOTE: stats must be any of these ['count', 'min', 'max', 'mean', 'sum', 'std', 'median', 'majority', 'minority', 'unique', 'range', 'nodata', 'nan']
        zonal_stat = zonal_stats(geodataframe.geometry, param_array, affine = param.transform, geojson_out = True, nodata = param.nodata, all_touched = method, stats = statistic)
        
        # Extracting the statistics from the list
        for j in range(len(statistic)):
            gdf[parameter + '_' + date + '_' + statistic[j]] = np.nan
            indx = list(gdf.columns).index(parameter + '_' + date + '_' + statistic[j])
            for i in range(np.size(geodataframe,0)):
                gdf.iloc[i,indx] = zonal_stat[i]['properties'][statistic[j]]

    return gdf
# Nu alleen nog de metrics toevoegen: slope en gaan we al afnemen?