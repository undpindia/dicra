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
from sklearn.inspection import permutation_importance
import shap

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

    year_month = [str(year) + '-01', str(year) + '-02', str(year) + '-03', str(year) + '-04', str(year) + '-05', str(year) + '-06', str(year) + '-07', str(year) + '-08', str(year) + '-09', str(year) + '-10', str(year) + '-11', str(year) + '-12', str(year+1) + '-01', str(year+1) + '-02', str(year+1) + '-03', str(year+1) + '-04', str(year+1) + '-05', str(year+1) + '-06']

    files = os.listdir(path)
    file_names = []
    for i in range(len(year_month)):
        group = list(filter(lambda x: year_month[i] in x, files))
        file_names.append(group)
    file_names = sum(file_names, [])

    for f in file_names:
        date = re.search('.*\_(.*?)\..*', f).group(1)#[5:]
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
        year_month = [str(year) + '-05', str(year) + '-06', str(year) + '-07', str(year) + '-08', str(year) + '-09', str(year) + '-10']#, str(year) + '-11']        
    elif season == 'rabi':
        # rabi prediction
        year_month = [str(year) + '-09', str(year) + '-10', str(year) + '-11', str(year) + '-12', str(year+1) + '-01', str(year+1) + '-02']#, str(year+1) + '-03', str(year+1) + '-04', str(year+1) + '-05', str(year+1) + '-06']
    elif season == 'summer':
        # zaid prediction
        year_month = [str(year) + '-01', str(year) + '-02', str(year) + '-03', str(year) + '-04', str(year) + '-05', str(year) + '-06']#, str(year) + '-07']  

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
    c = 0
    gdf = geodataframe.copy()
    year = geodataframe['Year'].unique()[0] # Year
    season = geodataframe['Season'].unique()[0].lower() # Season

    if season == 'kharif':
        # kharif prediction
        year_month = [str(year) + '-05', str(year) + '-06', str(year) + '-07', str(year) + '-08', str(year) + '-09', str(year) + '-10', str(year) + '-11']        
    elif season == 'rabi':
        # rabi prediction
        year_month = [str(year) + '-09', str(year) + '-10', str(year) + '-11', str(year) + '-12', str(year+1) + '-01', str(year+1) + '-02', str(year+1) + '-03', str(year+1) + '-04', str(year+1) + '-05', str(year+1) + '-06']
    elif season == 'summer':
        # zaid prediction
        year_month = [str(year) + '-01', str(year) + '-02', str(year) + '-03', str(year) + '-04', str(year) + '-05', str(year) + '-06', str(year) + '-07']  

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
            if (parameter == 'Precipitation') or (parameter == 'SIF') or (parameter == 'LST') or (parameter == 'LSTN'):
                gdf[parameter + '_' + date + '_' + statistic[j]] = np.nan
                indx = list(gdf.columns).index(parameter + '_' + date + '_' + statistic[j])
            else:
                c += 1
                gdf[str(c) + '_' + parameter + '_' + statistic[j]] = np.nan
                indx = list(gdf.columns).index(str(c) + '_' + parameter + '_' + statistic[j])
            
            for i in range(np.size(geodataframe,0)):
                gdf.iloc[i,indx] = zonal_stat[i]['properties'][statistic[j]]

    return gdf
# Nu alleen nog de metrics toevoegen: slope en gaan we al afnemen?

def soiltype(geodataframe, parameter, path, statistic, method):
    # action = True/False
    gdf = geodataframe.copy()
    year = geodataframe['Year'].unique()[0] # Year
    season = geodataframe['Season'].unique()[0].lower() # Season

    file_name = 'soiltype_Karnataka_' + str(year) + '.tif'

    file_path = path + file_name
    param = rasterio.open(file_path, mode = 'r')
    # Assign raster values to a numpy nd array
    param_array = param.read(1) # landuse corresponding to each rasterpixel, so we extracted the pixel values from the raster    
    # NOTE: stats must be any of these ['count', 'min', 'max', 'mean', 'sum', 'std', 'median', 'majority', 'minority', 'unique', 'range', 'nodata', 'nan']
    zonal_stat = zonal_stats(geodataframe.geometry, param_array, affine = param.transform, geojson_out = True, nodata = param.nodata, all_touched = method, stats = statistic)
    
    # Extracting the statistics from the list
    for j in range(len(statistic)):
        gdf[parameter + '_' + statistic[j]] = np.nan
        indx = list(gdf.columns).index(parameter + '_' + statistic[j])
        for i in range(np.size(geodataframe,0)):
            gdf.iloc[i,indx] = zonal_stat[i]['properties'][statistic[j]]

    return gdf

def soiltype_one(geodataframe, parameter, path, statistic, method):
    # action = True/False
    gdf = geodataframe.copy()
    year = geodataframe['Year'].unique()[0] # Year
    
    param = rasterio.open(path, mode = 'r')
    # Assign raster values to a numpy nd array
    param_array = param.read(1) # landuse corresponding to each rasterpixel, so we extracted the pixel values from the raster    
    # NOTE: stats must be any of these ['count', 'min', 'max', 'mean', 'sum', 'std', 'median', 'majority', 'minority', 'unique', 'range', 'nodata', 'nan']
    zonal_stat = zonal_stats(geodataframe.geometry, param_array, affine = param.transform, geojson_out = True, nodata = param.nodata, all_touched = method, stats = statistic)
    
    # Extracting the statistics from the list
    for j in range(len(statistic)):
        gdf[parameter + '_' + statistic[j]] = np.nan
        indx = list(gdf.columns).index(parameter + '_' + statistic[j])
        for i in range(np.size(geodataframe,0)):
            gdf.iloc[i,indx] = zonal_stat[i]['properties'][statistic[j]]

    return gdf

def RandomSearch(n_estimators_, max_features_, max_depth_, min_samples_split_, min_samples_leaf_, bootstrap_, cv_strategy, train_data, predictor, features, n_iters):
    X = train_data[features]
    Y = train_data[predictor]

    # Create the random grid
    random_grid = {'n_estimators': n_estimators_,
                'max_features': max_features_,
                'max_depth': max_depth_,
                'min_samples_split': min_samples_split_,
                'min_samples_leaf': min_samples_leaf_,
                'bootstrap': bootstrap_}

    # Create a based model
    rf = RandomForestRegressor()
    # The function randomly tries n_iter combinations of the random grid
    rf_random = RandomizedSearchCV(estimator = rf, param_distributions = random_grid, n_iter = n_iters, cv = cv_strategy, verbose = 0, n_jobs = -1, random_state = 1234) # 1234 for geo, 42 for random, 0 for time
    # Fit the random search model
    rf_random.fit(X,Y)
    # Return the best combonation out of the n_iter combinations
    return(rf_random.best_params_)

def GridSearch(init_params, cv_strategy, train_data, predictor, features):
    X = train_data[features]
    Y = train_data[predictor]

    if init_params['n_estimators'] < 1000:
        if init_params['n_estimators']-100 <= 0:
            n_est = np.arange(100, 151, 50).tolist()
        else:    
            n_est = np.arange(init_params['n_estimators']-100, init_params['n_estimators']+151, 50).tolist()
        n_est.append(1000)
    else:
        n_est = np.arange(init_params['n_estimators']-100, init_params['n_estimators']+101, 50).tolist()

    if init_params['max_depth'] <= 1:
        max_dep = np.arange(1, 8,3).tolist()
        max_dep.append(2)
    elif init_params['max_depth'] >= 8:
        max_dep = np.arange(init_params['max_depth']-2, init_params['max_depth']+2,1).tolist()
    else:
        max_dep = np.arange(init_params['max_depth']-2, init_params['max_depth']+2,1).tolist()

    if init_params['min_samples_split'] - 2 <= 1:
        min_samp_split = np.arange(2, init_params['min_samples_split']+2, 2).tolist()
    else: 
        min_samp_split = np.arange(init_params['min_samples_split']-2, init_params['min_samples_split']+2, 1).tolist()

    if init_params['min_samples_leaf'] - 2 <= 0:
        min_samp_leaf = np.arange(1, 4, 1).tolist()
    else:
        min_samp_leaf = np.arange(init_params['min_samples_leaf']-1, init_params['min_samples_leaf']+2, 1).tolist()

    if init_params['bootstrap'] == True:
        boot = [init_params['bootstrap']]
    else:
        boot = [True, False]
    #boot = [True, False]
    #boot = [True]
    #max_feat = [init_params['max_features'], math.ceil(len(features)/3)] # DEZE NIEUW TOEGEVOEGD

    # Create the parameter grid
    parameter_grid = {'n_estimators': n_est,
                'max_features': [math.ceil(len(features)/3)], #DEZE VERVANGEN DOOR HIERBENEDEN
                #'max_features': max_feat,
                'max_depth': max_dep,
                'min_samples_split': min_samp_split,
                'min_samples_leaf': min_samp_leaf,
                'bootstrap': boot}

    # Create a based model
    rf = RandomForestRegressor()
    # Instantiate the grid search model
    grid_search = GridSearchCV(estimator = rf, param_grid = parameter_grid, cv = cv_strategy, verbose = 0, n_jobs = -1)
    # Fit the grid search to the data
    grid_search.fit(X, Y)

    return grid_search.best_params_          

# This function is used for the Blocking Split Cross Validation
class PanelTimeSeriesSplit():
    def __init__(self, n_splits, threshold, num_train, num_val):
        self.n_splits = n_splits
        self.num_train = num_train
        self.num_val = num_val
        self.threshold = threshold
    
    def get_n_splits(self, X, y, groups):
        return self.n_splits
        return self.num_train
        return self.num_val
        return self.threshold
    
    def split(self, X, y=None, groups=None):
        train_set = X.iloc[:self.threshold,:]
        val_set = X.iloc[self.threshold:,:]
        for i in range(self.n_splits):
            # Hier moetten we telkens die random split maken en de indices vertellen
            index_train = train_set.sample(n=self.num_train, replace=False).index
            index_val = val_set.sample(n=self.num_val, replace=False).index
            yield np.array(index_train), np.array(index_val)


def permutation_importances(rf_model, features_com, predictor, test_dataset, path, length):

    X_val = test_dataset[features_com]
    y_val = test_dataset[predictor]

    importances_info = permutation_importance(rf_model, X_val, y_val, n_repeats=30, random_state=0)

    importances = importances_info['importances_mean']
    importances_std = importances_info['importances_std']
    feature_importances = [(feature, round(importance, 15), importances_std) for feature, importance, importances_std in zip(features_com, importances, importances_std)]
    feature_importances = sorted(feature_importances, key = lambda x: x[1], reverse = True)

    names=[]
    values=[]
    values_std = []

    for i in range(0, len(importances)):
        names.append(feature_importances[i][0])
        values.append(feature_importances[i][1])
        values_std.append(feature_importances[i][2])

    plt.rcParams["figure.figsize"] = (20,3)
    plt.bar(names[:length], values[:length], yerr = values_std[:length])
    plt.tick_params(labelsize=16)
    plt.xticks(names[:length], rotation='vertical', fontsize = 16)
    plt.ylabel('Decrease in $R^2$ if feature is permuted', fontsize = 16); plt.xlabel('Feature', fontsize = 16); plt.title('Feature Importances', fontsize = 18)
    plt.savefig(path, bbox_inches='tight')
    plt.show()

    #print('Feature Importances: ' + str(feature_importances))

    return(feature_importances)


def SHAP_explainer(rf_model, train_dataset, features_com, predictor, length):
    rf_model = shap.TreeExplainer(rf_model)
    shap_values_rf_train = rf_model.shap_values(train_dataset[features_com])

    plt.title('SHAP ' + predictor)
    shap.summary_plot(shap_values_rf_train, train_dataset[features_com], max_display = length)
    return()


def monthly_exploration(geodataframe, parameter, path, statistic, method, beginyear, endyear):
    # action = True/False
    gdf = geodataframe.copy()
    for year in range(beginyear,endyear+1):
        year_month = [str(year) + '-01', str(year) + '-02', str(year) + '-03', str(year) + '-04', str(year) + '-05', str(year) + '-06', str(year) + '-07', str(year) + '-08', str(year) + '-09', str(year) + '-10', str(year) + '-11', str(year) + '-12']#, str(year) + '-07']  

        files = os.listdir(path)
        file_names = []
        for i in range(len(year_month)):
            group = list(filter(lambda x: year_month[i] in x, files))
            file_names.append(group)
        file_names = sum(file_names, [])

        for f in file_names:
            date = re.search('.*\_(.*?)\..*', f).group(1)
            file_path = path + f
            param = rasterio.open(file_path, mode = 'r')
            # Assign raster values to a numpy nd array
            param_array = param.read(1) # landuse corresponding to each rasterpixel, so we extracted the pixel values from the raster    
            # NOTE: stats must be any of these ['count', 'min', 'max', 'mean', 'sum', 'std', 'median', 'majority', 'minority', 'unique', 'range', 'nodata', 'nan']
            zonal_stat = zonal_stats(geodataframe.geometry, param_array, affine = param.transform, geojson_out = True, nodata = param.nodata, all_touched = method, stats = statistic)
            
            # Extracting the statistics from the list
            for j in range(len(statistic)):
                gdf[date + '_' + statistic[j]] = np.nan
                indx = list(gdf.columns).index(date + '_' + statistic[j])
                for i in range(np.size(geodataframe,0)):
                    gdf.iloc[i,indx] = zonal_stat[i]['properties'][statistic[j]]

    return gdf