import geopandas as gpd
import pandas as pd
import rasterio
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import STL
import numpy as np
from sklearn.linear_model import LinearRegression
import datetime as dt
from matplotlib.colors import TwoSlopeNorm
import time

import warnings
warnings.filterwarnings("ignore")

def regional_fires(adm_name):


    viirs = pd.read_csv('VIIRS1.csv')  #ENTER THE CSV FILE NAME AND LOCATION HERE

    fire_pts = gpd.GeoDataFrame(viirs,                        #Converting fire points into dataframe
                            geometry=gpd.points_from_xy(
                                viirs.longitude,
                                viirs.latitude),
                            crs=4326)

    fire_mh = fire_pts.clip(adm_name)                   #Clipping fire points with Telangana boundaries
    fire_mh = fire_mh.sort_values(by=["acq_date"])#Sorting points by date

    return fire_mh        #return dataframe of regional fire points here

# Create a function to clasify agricultural and non-agriculturakl fire points
def fire_class(gdf):
    #list of coordinates for all points
    coords = [(x,y) for x, y in zip(gdf.longitude, gdf.latitude)]
    # Open the raster and store metadata
    src = rasterio.open('mosaic.tif')
    # Sample the raster at every point location and store values in GeoDataFrame
    gdf['Class'] = [x[0] for x in src.sample(coords)]       #list all pixel values (classes) from LULC raster file
    classes = list(gdf.Class.unique())                      #list all unique classes
    crop_class = [4,5]                                      #crop class - 4, flooded vegetation(paddy) -5
    non_crop_class = classes - crop_class                   #Non agricultural classes
    gdf['Class'] = gdf['Class'].replace(non_crop_class,0)   # non agri class to 0
    gdf['Class'] = gdf['Class'].replace(crop_class,1)       # agri class to 1
    gdf = gdf.reset_index()         
    del gdf['index']                                        
    gdf = gdf.reset_index()
    gdf.rename(columns = {'index':'fireID'}, inplace = True)# give eac fire points a unique ID
    return gdf                                              # return classified dataframe


def Trend_Score(df, index:int): 
    """Determines the trend score of a polygon it takes as input a dataframe that counts the fires per region per month and the index of a specific region and returns 
    the deviance score of that particular region"""
    df_selected = df[df['index'] == index]  
    df_selected = df_selected.sort_values(by=['ModifiedDateTime'])
    df_selected.index = df_selected['ModifiedDateTime']

    if not df_selected.empty:

        X = df_selected['Fires']

        #Decompose using STL Seasonal-Trend Decomposition using LOESS
        stl = STL(df_selected['Fires'], period=2, seasonal=7)
        res = stl.fit()

        df_trend = res.trend.to_frame().reset_index().dropna()

        #Date needs to be converted to a numerical value
        df_trend['ModifiedDateTime_num'] = df_trend['ModifiedDateTime'].map(dt.datetime.toordinal)

        #Set the data in the right format for Linear Regression
        X = np.array(df_trend['ModifiedDateTime_num'])
        X = X.reshape(-1, 1)
        y = np.array(df_trend['trend'])
        y = y.reshape(-1, 1)

        #Perform Linear Regression and obtain the slope
        reg = LinearRegression().fit(X, y)
        y_pred_trend = reg.predict(X)
        slope, intercept = np.polyfit(np.array(df_trend['ModifiedDateTime_num']), y_pred_trend,1)
        line_slope = slope[0]

    else:
        #If the dataframe is empty there are no fires in that region at all, also no slope line. We are not interested in these regions.
        line_slope = 'Unknown'

    return(line_slope)


def fire_counts(beginyear:int, endyear:int, boundaries, level:str):
    """Creates a visualization of all the slope scores for each region. It takes as input the begin- and endyear of interest, the fire data, the boundaries of the regions we are interested in. """
    gdf = regional_fires(boundaries)
    fires_data_classified = fire_class(gdf)
    fire_data = fires_data_classified[fires_data_classified['Class'] == 1]

    st = time.time()

    #Make sure the geometry columns are in the right format
    geo_fire_data = fire_data[['geometry', 'acq_date', 'fireID']]
    geo_fire_data['geometry'] = geo_fire_data['geometry'].to_crs(epsg = 4326)
    geo_fire_data['acq_date'] =  pd.to_datetime(geo_fire_data['acq_date'])
    geo_fire_data['year'] = (geo_fire_data['acq_date']).dt.year
    geo_fire_data['month'] = (geo_fire_data['acq_date']).dt.month
    geo_fire_data['day'] = (geo_fire_data['acq_date']).dt.day
    geo_fire_data = geo_fire_data[(geo_fire_data['acq_date'] >= str(beginyear)+'-01-01') & (geo_fire_data['acq_date'] < str(endyear+1)+'-01-01')]
    fires_per_boundaries= gpd.sjoin(geo_fire_data, boundaries, how="inner")

    geo_fire_data['geometry'] = geo_fire_data['geometry'].to_crs(epsg = 4326)
    boundaries = gpd.GeoDataFrame(boundaries,geometry = boundaries.geometry, crs = {'init': 'epsg:4326'}) 

    #Load date into date format
    geo_fire_data['acq_date'] =  pd.to_datetime(geo_fire_data['acq_date'])
    geo_fire_data['year'] = (geo_fire_data['acq_date']).dt.year
    geo_fire_data['month'] = (geo_fire_data['acq_date']).dt.month
    geo_fire_data['day'] = (geo_fire_data['acq_date']).dt.day

    #Selects the years we are interested in, depending on the input of the function
    geo_fire_data = geo_fire_data[(geo_fire_data['acq_date'] >= str(beginyear)+'-01-01') & (geo_fire_data['acq_date'] < str(endyear+1)+'-01-01')]

    #Count all fires within a region given by the boundaries dataframe
    fires_per_boundaries= gpd.sjoin(geo_fire_data, boundaries, how="inner")

    #Create the right time format: We count per month
    fires_per_boundaries['day'] = 1 
    fires_per_boundaries['year'] = pd.Series(pd.to_numeric(fires_per_boundaries['year'], errors='coerce'), dtype='int64')
    fires_per_boundaries['month'] = pd.Series(pd.to_numeric(fires_per_boundaries['month'], errors='coerce'), dtype='int64')
    fires_per_boundaries['ModifiedDateTime'] = pd.to_datetime(fires_per_boundaries[['year', 'month', 'day']].astype('int64').astype('str'), yearfirst=True)

    #Sum amount of fires per mandal per month per year make sure that if no fire happens at a specific time write a zero
    fires_per_boundaries_count = fires_per_boundaries.groupby(['index', 'ModifiedDateTime'])['fireID'].count().unstack(fill_value=0).stack().reset_index()
    fires_per_boundaries_count['Fires'] = fires_per_boundaries_count[0] 

    #Delete column
    del fires_per_boundaries_count[0]

    fires_per_boundaries_count['ModifiedDateTime'] =  pd.to_datetime(fires_per_boundaries_count['ModifiedDateTime'])

    #We will loop over all boundaries and calculate it's deviant score
    ids= []
    scores = []


    for i in range(0, len(boundaries['index'])):
        ids.append(boundaries['index'].iloc[i])
        #We use the previously defined function in order to calculate the trend score per specific area
        score = Trend_Score(fires_per_boundaries_count, i)
        scores.append(score)

    #Create a Dataframe from the scores
    DPPD_df = pd.DataFrame({'index': ids, 'Slope Score': scores}) 


    #Only select the regions that do not have unknown scores
    DPPD_df = DPPD_df[DPPD_df['Slope Score'] != 'Unknown']

    #We merge the dataframe with the boundaries dataframe such that we have the geometry variable
    DPPD_df = DPPD_df.merge(boundaries[['index', 'geometry']], how='left', on=['index'])

    #Making sure data has the right type
    DPPD_df = gpd.GeoDataFrame(DPPD_df, geometry = DPPD_df.geometry, crs = {'init': 'epsg:4326'}) 
    DPPD_df['Slope Score'] = DPPD_df['Slope Score'].astype('float')

    DPPD_df.to_csv('DPPD_Fires_'+str(beginyear) +'-' + str(endyear)+ level + '.csv')
    DPPD_df = gpd.GeoDataFrame(DPPD_df, geometry = DPPD_df.geometry, crs = {'init': 'epsg:4326'}) 
    DPPD_df.to_file('DPPD_Fires_'+str(beginyear) +'-' + str(endyear)+level+'.geojson', driver="GeoJSON") 
    #Define text for the plots
    text = 'Changes in Amount of Fires over the Years STL ' + level + ' level ('+ str(beginyear) +'-'+str(endyear)+')'

    ranges = max(abs(DPPD_df['Slope Score'].min()), (DPPD_df['Slope Score'].max()))
    vmin, vmax, vcenter = ranges*-1 , ranges, 0
    norm = TwoSlopeNorm(vmin= vmin , vcenter=vcenter, vmax= vmax) 
    # create a normalized colorbar
    cmap = 'RdYlGn_r'
    cbar = plt.cm.ScalarMappable(norm=norm, cmap=cmap)
    base = boundaries.plot(color='white', edgecolor='black',figsize = [20,20])
    DPPD_df.plot(ax = base,
        column = 'Slope Score', 
                        legend = True, 
                        figsize = [20,20],\
                        legend_kwds = {'label': 'Deviance'}, 
                        cmap = 'RdYlGn_r',
                        norm = norm)
    plt.title(text)
    plt.savefig(text + '.png', bbox_inches='tight')

    #Print the time it took to run this is no more than 15 min no matter the boundary type
    print('Scores are calculated in',  str((time.time()-st)/60) , ' minutes')

    return(plt.show(), DPPD_df)
