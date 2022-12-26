import pandas as pd
import os
import geopandas as gpd
import matplotlib.pyplot as plt
import rasterio
from statsmodels.tsa.seasonal import STL
import numpy as np
from sklearn.linear_model import LinearRegression
import datetime as dt
from matplotlib.colors import TwoSlopeNorm
import time
from rasterstats import zonal_stats
from scipy.stats import pearsonr
import plotly.express as px
import re

import warnings
warnings.filterwarnings('ignore')

# How to import this file to another jupyter notebook file:
# 1.
#import sys 
#import os
#sys.path.append(os.path.abspath("C:/Users/mieke/Documents/Msc Thesis/Notebooks Python/Others"))
#import functions_time_series
# 2.
#%load C:/Users/mieke/Documents/Msc Thesis/Notebooks Python/Others/functions_time_series.py  

# Read data from tiff files and put mean pixel values per polygon within a dataframe
def create_df(colname, boundaries, folder_path, method, date_format):
    columns =['index', colname,'geometry']
    param_df = boundaries[columns].copy()

    file_names = os.listdir(folder_path) # contains all filenames within the folder param_masked
    for i in file_names:
        path = folder_path + i # the path of the selected GeoTIFF
        param = rasterio.open(path, mode = 'r') # open the selected GeoTIFF
        param_array = param.read(1) # Assign raster values to a numpy nd array
        affine = param.transform

        # For each image, we calculate the mean pixel/parameter value for every geometry within the dataframe
        zonal_param = zonal_stats(boundaries, param_array, affine = affine, stats=['mean'], geojson_out = True, nodata = param.nodata, all_touched = method)
        date_time = str(i[date_format[0]:date_format[1]]) + '-' + str(i[date_format[2]:date_format[3]]) + '-' + str(i[date_format[4]:date_format[5]]) # YEAR-MONTH-DAY
        param_df[date_time] = np.nan 
        for k in range(len(boundaries)):
            param_df[date_time].iloc[k] = zonal_param[k]['properties']['mean']

    param_df = param_df.iloc[:, 3:].transpose().reset_index()
    num_nan = param_df.isna().sum().sum() # Determine the number of NaN values
    param_df.iloc[:,1:] = param_df.iloc[:,1:].ffill() # Use forward fill to determine the values for NaN values
    param_df.iloc[:,1:] = param_df.iloc[:,1:].bfill() # If we have still some NaN values, we use backward fill
    param_df['Calendar Date'] = pd.to_datetime(param_df['index'])

    return(num_nan, param_df)

# This function determines the trend score regarding param for each polygon. The function returns the deviance of each polygon
def Trend_Score(df, period, seasonal, index:int): 
    # df: dataframe containing the average value of param per polygon (each column represents a polygon)
    # period, seasonal: parameters needed for running an STL model

    df_selected = df[['Calendar Date', index]].copy() # Select the index and the calendar date from the dataframe of interest
    df_selected = df_selected.sort_values(by=['Calendar Date']) # Sort values based on their dates
    df_selected.index = df_selected['Calendar Date'] # Set index equal to the Date Times

    if not df_selected.empty: # If the dataframe is not empty
        X = df_selected[index].copy() # Dataframe consisting of index column of dataframe of interest

        # Decompose using STL Seasonal-Trend Decomposition using LOESS
        # eg. period = 17, since there are approximately 17 images within a season/cycle (102/6=17)
        # eg. seasonal = 5, since there are approximately 5 full seasons/cycles within the dataset (for visualization, see cell at bottom)
        stl = STL(X, period=period, seasonal=seasonal, robust=True) 
        res = stl.fit()

        df_trend = res.trend.to_frame().reset_index().dropna() # drop the nan values from the dataframe (there are none)       
        df_trend = df_trend.reset_index()
        df_trend['Calendar Date_num'] = df_trend['index']
        #df_trend['Calendar Date_num'] = df_trend['Calendar Date'].map(dt.datetime.toordinal) # Convert the date to a numerical value

        # Put the data in the right format for Linear Regression
        X = np.array(df_trend['Calendar Date_num'])
        X = X.reshape(-1, 1)
        y = np.array(df_trend['trend'])
        y = y.reshape(-1, 1)

        # Perform Linear Regression and obtain the slope in order to determine the deviance scores
        reg = LinearRegression().fit(X, y)
        y_pred_trend = reg.predict(X)
        slope, intercept = np.polyfit(np.array(df_trend['Calendar Date_num']), y_pred_trend,1)
        line_slope = slope[0]

    else:
        # If the dataframe is empty, there is no slope line. We are not interested in these regions.
        line_slope = 'Unknown'

    return(line_slope)

# This function determines the trend scores and deviance scores using the trend_score function and then visualizes the results.
def dppd_function(data, state, beginyear, endyear, param, boundaries, level_name, period, seasonal):
    data['Calendar Date'] = pd.to_datetime(data['Calendar Date']) # Convert the calendar date to datetime object
    data = data[(data['Calendar Date']<str(endyear+1)+'-01-01') & (data['Calendar Date']>str(beginyear-1)+'-12-31')] # Select the calendar date period of interest

    ids= []
    scores = []
    # This for loop calculates a deviance score for each polygon
    for i in data.columns[1:-1]:
        ids.append(i)
        score = Trend_Score(data, period, seasonal, i) # calculate the trend score per specific area
        scores.append(score)

    # Create a Dataframe containing the deviance scores for each polygon
    DPPD_df = pd.DataFrame({'index': ids, 'Slope Score': scores}) 

    # We are only interested in regions that do not have unknown scores
    DPPD_df = DPPD_df[DPPD_df['Slope Score'] != 'Unknown']
    DPPD_df['index'] = DPPD_df['index'].astype(int)

    # Merge the dataframe with the boundaries dataframe such that the corresponding geometry is added
    DPPD_df = DPPD_df.merge(boundaries[['index', 'geometry']], how='left', on=['index'])

    # Translate the dataframe to a geodataframe
    DPPD_df = gpd.GeoDataFrame(DPPD_df, geometry = DPPD_df.geometry, crs = {'init': 'epsg:4326'}) 
    DPPD_df['Slope Score'] = DPPD_df['Slope Score'].astype('float')

    # Define text for the plots
    text = 'Changes in ' + param + ' ' + str(beginyear) + '-' + str(endyear) + ' on ' + level_name + ' level'
    ranges = max(abs(DPPD_df['Slope Score'].min()), (DPPD_df['Slope Score'].max())) # Determine range for the color bar
    # Create a normalized colorbar
    vmin, vmax, vcenter = ranges*-1 , ranges, 0
    norm = TwoSlopeNorm(vmin= vmin , vcenter=vcenter, vmax= vmax) 
    cmap = 'RdYlGn' # Select a colormap
    # Plot the deviance analysis
    cbar = plt.cm.ScalarMappable(norm=norm, cmap=cmap)
    DPPD_df.plot(column = 'Slope Score', 
                        legend = True, 
                        figsize = [20,10],\
                        legend_kwds = {'label': 'Deviance'}, 
                        cmap = 'RdYlBu_r',
                        norm = norm)
    plt.title(text)

    # Save the image
    plt.savefig('C:/Users/mieke/Documents/Data_analysis/' + state + '/' + param + '/Plots/deviance_analysis_' + param + '_' + level_name + '_' + str(beginyear) + '-' + str(endyear) + '.png', bbox_inches='tight')
    plt.show()

    return(scores)