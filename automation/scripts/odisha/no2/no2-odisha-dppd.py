'''
#DPPD Analysis
#This code is to calculate DPPD at any boundary level

#First, install the essential libraries

!pip install geopandas
!pip install rasterio
!pip install rasterstats
!pip install rioxarray
!pip install georasters

'''

#Import Libraries

import warnings
warnings.filterwarnings('ignore')

import pandas as pd
import os
import geopandas as gpd

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
import rioxarray
import georasters as gr
from affine import Affine


import time

##################################################################################################################################

#Every file type and state base folder should be set in the beginning of the program
statebase = '/nfsdata/no2/odisha'
scriptbase= statebase + '/dppd'


#Create a function to calculate DPPD

def Trend_score(df, i):
    sdf = pd.Series(list(df[i]), index=pd.to_datetime(df['Date']), name="Fires")
    stl = STL(sdf,period=2, seasonal=7)
    res = stl.fit()

    #Set the data in the right format for Linear Regression
    x = np.array(df['DateOrdinal'])
    X = x.reshape(-1, 1)
    y = np.array(res.trend)
    y = y.reshape(-1, 1)

    #Perform Linear Regression and obtain the slope
    reg = LinearRegression().fit(X, y)
    y_pred_trend = reg.predict(X)
    slope, intercept = np.polyfit(x, y_pred_trend,1)
    
    return slope[0]

##################################################################################################################################


def dppd_raster(file_directory:str, dppd_tif_name:str):

    #list raster files(LAI here) of a particular state


    files = os.listdir(file_directory)
    files.sort()

    #Convert all rasters to DataFrame and store pixel values in another dataframe
    #This process takes around 5-8mins

    df = pd.DataFrame()
    for i in files:
        myRaster = file_directory+i
        elevation = gr.from_file(myRaster)
        elevation = elevation.to_pandas()
        i = i[:4]+'-'+i[5:7]+'-'+i[8:10]
        df[i] = elevation[True]
    #df['geometry'] = elevation['geometry']

    df = df.T
    df['Date'] = df.index
    df['Date'] = pd.to_datetime(df['Date'])
    DateOrdinal = [dt.datetime.toordinal(i) for i in df['Date']]
    df['DateOrdinal'] = DateOrdinal
    df = df.reset_index()
    del df['index']


    #Calculate DPPD for each pixel
    #This process took aroun 70mins for 500m resolution raster data time will differ as multiple of the size of raster

    slopes = [Trend_score(df, i) for i in df.columns[:-2]]


    #Take an input raster image's information to create DPPD raster file

    myRaster = file_directory+files[0]

    df1 = gr.from_file(myRaster)
    df1 = df1.to_pandas()

    dataset = rasterio.open(myRaster)
    kwargs = dataset.meta


    #Rioxarray values are reveresed, so reverse it as per input raster image
                                
    df2 = df1[['y','x']]
    df2['deviance'] = slopes
    da = df2.set_index(['y', 'x']).to_xarray()
    da = da.set_coords(['y', 'x'])

    res = np.array(da.deviance)
    reversedArr = res[::-1]
    reversedArr.shape

    #update raster dtype as per DPPD dtype and store value in a raster

    kwargs.update(
        {"dtype": da.deviance.dtype.name}
    )
    res = np.array(da.deviance)
    res = res[::-1]
    with rasterio.open(dppd_tif_name, mode='w', **kwargs) as src:
        src.dtype = 'float64'
        src.write(res, indexes = 1)

    return "DPPD Tiff Created!!"

##################################################################################################################################

def per_boundary(boundary_directory:str, dppd_tif_name, file_name_to_save:str):

    #Calculate DPPD as per Boundaries:

    boundary = gpd.read_file(boundary_directory)

    mean_deviance = [zonal_stats(boundary.iloc[index]["geometry"], dppd_tif_name, stats="mean")[0]['mean'] for index in boundary.index]


    boundary['deviance'] = mean_deviance

    #rearranfe dataframe
    
    col_list = list(boundary)
    col_list[-1], col_list[-2] = col_list[-2], col_list[-1]
    boundary = boundary[col_list]

    boundary = gpd.GeoDataFrame(boundary)

    boundary = boundary.dropna()


    #create np array of list
    res = np.array(boundary['deviance'])
    #check min value of res, if min value is not less than 0 then there will be no negative deviance
    print(np.min(res))
    #normalize results: (-1,0) for negative values and (0,1) for positive values
    data_norm = np.where(res >= 0, res/np.max(res), -res/np.min(res))

    boundary['deviance'] = data_norm

    boundary.to_file(file_name_to_save)

    return "DPPD JSON Created!!"






#TEST
#ADD SAME CODE LINES MENTIONS BELOW FOR OTHER BOUNDARY DATASETS


boundary_directory = statebase + '/base/Odisha_state_shapefile_for_clip.geojson'   #District or Taluka or 1km grid


#file_directory = 'Directory of COG created files'
file_directory = statebase + "/process/cog_no2"

file_name_to_save = 'state_boundaryname_deviance.json'

dppd_tif_name = scriptbase + '/Odisha_state_DPPD.tif'

dppd_raster(file_directory, dppd_tif_name)

per_boundary(boundary_directory, dppd_tif_name, file_name_to_save)




