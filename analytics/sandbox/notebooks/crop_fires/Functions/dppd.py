import pandas as pd
import os
import geopandas as gpd
import geoplot
import geoplot.crs as gcrs
import matplotlib.pyplot as plt
import rasterio
from statsmodels.tsa.seasonal import STL
import numpy as np
from sklearn.linear_model import LinearRegression
import datetime as dt
from matplotlib.colors import TwoSlopeNorm
import time

import warnings
warnings.filterwarnings('ignore')


def Trend_Score(df, index:int, seas:int): 
    """Determines the trend score of a polygon it takes as input a dataframe that counts the fires per region per month and the index of a specific region and returns 
    the deviance score of that particular region"""
    df_selected = df[df['index'] == index] 
    df_selected = df_selected.sort_values(by=['ModifiedDateTime'])
    df_selected.index = df_selected['ModifiedDateTime']

    if not df_selected.empty:

        X = df_selected['Fires']

        #Decompose using STL Seasonal-Trend Decomposition using LOESS we choose seas based on the amount of years we fill in. Note that this number needs to be odd and we choose period based on the amount 
        #of observations per season also 12, because there 12 months within a year.
        stl = STL(df_selected['Fires'], seasonal = seas, period = 12, robust = True)
        res = stl.fit()

        df_trend = res.trend.to_frame().reset_index().dropna()

        #Date needs to be converted to a numerical value
        df_trend = df_trend.reset_index()
        df_trend['ModifiedDateTime_num'] = df_trend['index']
        #df_trend['ModifiedDateTime_num'] = df_trend['ModifiedDateTime'].map(dt.datetime.toordinal)

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
        line_slope = 0

    return(line_slope)


def dppd_fires(beginyear:int, endyear:int, fire_data, boundaries, level:str, variable_of_interest):
    """Creates a visualization of all the slope scores for each region. It takes as input the begin- and endyear of interest, the fire data, 
    the boundaries of the regions we are interested in. """
    st = time.time()
    
    #Get the right parameter for seasonal (needs to be odd)
    if (endyear-beginyear+1)%2==0:
        seas = endyear-beginyear
    else:
        seas = endyear-beginyear+1
        
    #Create geodataframe from the data
    geo_fire_data = gpd.GeoDataFrame(fire_data,geometry = fire_data.geometry, crs = {'init': 'epsg:4326'}) 

    #Make sure the geometry columns are in the right format
    geo_fire_data = geo_fire_data[['geometry', 'acq_date', 'fireID', 'frp']]
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

    if variable_of_interest == 'fires':

        #Sum amount of fires per mandal per month per year make sure that if no fire happens at a specific time write a zero
        fires_per_boundaries_count = fires_per_boundaries.groupby(['index', 'ModifiedDateTime'])['fireID'].count().unstack(fill_value=0).stack().reset_index()
        fires_per_boundaries_count['Fires'] = fires_per_boundaries_count[0] 

    elif variable_of_interest == 'frp':

        fires_per_boundaries_count = fires_per_boundaries.groupby(['index', 'ModifiedDateTime'])['frp'].mean().unstack(fill_value=0).stack().reset_index()
        fires_per_boundaries_count['Fires'] = fires_per_boundaries_count[0] 

    #Delete column
    del fires_per_boundaries_count[0]
    
    #Make sure date is in the right format
    fires_per_boundaries_count['ModifiedDateTime'] =  pd.to_datetime(fires_per_boundaries_count['ModifiedDateTime'])

    #We will loop over all boundaries and calculate it's deviant score
    ids= []
    scores = []

    for i in range(0, len(boundaries['index'])):
        ids.append(boundaries['index'].iloc[i])
        #We use the previously defined function in order to calculate the trend score per specific area
        score = Trend_Score(fires_per_boundaries_count, i, seas)
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

    os.chdir('c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\DPPD_Jesse\\Fires\\results')
    DPPD_df.to_csv('DPPD_Fires_'+str(beginyear) +'-' + str(endyear)+ level + '.csv')
    DPPD_df = gpd.GeoDataFrame(DPPD_df, geometry = DPPD_df.geometry, crs = {'init': 'epsg:4326'}) 
    DPPD_df.to_file('C:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\DPPD_Jesse\\Fires\\results\\DPPD_Fires_'+str(beginyear) +'-' + str(endyear)+level+'.geojson', driver="GeoJSON") 
    #Define text for the plots
    text = 'DPPD Fires STL ' + level + ' Level ('+ str(beginyear) +'-'+str(endyear)+')'
   
    #Create the figure
    #If the boundary level is Telangana we need to select our own min and max legend value 
    if level == 'telangana':
        #Make sure that legend is centered around 0
        norm = TwoSlopeNorm(vmin= -0.04 , vcenter=0, vmax= 0.04) 
        cmap = 'RdYlGn_r'
        DPPD_df.plot(column = 'Slope Score', 
                            legend = True, 
                            figsize = [20,10],\
                            legend_kwds = {'label': 'Deviance'}, 
                            cmap = 'RdYlGn_r',
                            norm = norm)
        plt.title(text)
        os.chdir('c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\DPPD_Jesse\\Fires\\results')
        plt.savefig(text + '.png', bbox_inches='tight')

    #Create the figure 
    else:
        ranges = max(abs(DPPD_df['Slope Score'].min()), (DPPD_df['Slope Score'].max()))
        vmin, vmax, vcenter = ranges*-1 , ranges, 0
        norm = TwoSlopeNorm(vmin= vmin , vcenter=vcenter, vmax= vmax) 
        # create a normalized colorbar
        cmap = 'RdYlGn_r'
        cbar = plt.cm.ScalarMappable(norm=norm, cmap=cmap)
        DPPD_df.plot(column = 'Slope Score', 
                            legend = True, 
                            figsize = [12,6],\
                            legend_kwds = {'label': 'Deviance: Monthly Changes in Number of Fires'}, 
                            cmap = 'RdYlGn_r',
                            norm = norm)
        plt.title(text)
        plt.axis('off')
        plt.savefig(text + '.png', bbox_inches='tight')
    
    #Print the time it took to run this is no more than 15 min no matter the boundary type
    print('Scores are calculated in',  str((time.time()-st)/60) , ' minutes')
    
    return(plt.show(), DPPD_df)

def correlation(data, beginyear, endyear, name, boundaries, col_name, level):
    data['ModifiedDateTime'] = pd.to_datetime(data['ModifiedDateTime'])
    data = data[(data['ModifiedDateTime']<str(endyear+1)+'-01-01') & (data['ModifiedDateTime']>str(beginyear)+'-01-01') ]

    #We will loop over all boundaries and calculate it's deviant score
    ids= []
    scores = []

    for i in data.columns[1:-1]:
        ids.append(i)
        #We use the previously defined function in order to calculate the trend score per specific area
        score = Trend_Score(data, i)
        scores.append(score)

    #Create a Dataframe from the scores
    DPPD_df = pd.DataFrame({'index': ids, 'Slope Score': scores, 'Averages': data.mean().to_list()}) 

    #Only select the regions that do not have unknown scores
    DPPD_df = DPPD_df[DPPD_df['Slope Score'] != 'Unknown']

    DPPD_df['index'] = DPPD_df['index'].astype(int)

    #We merge the dataframe with the boundaries dataframe such that we have the geometry variable
    DPPD_df = DPPD_df.merge(boundaries[['index', 'geometry']], how='left', on=['index'])

    #Making sure data has the right type
    DPPD_df = gpd.GeoDataFrame(DPPD_df, geometry = DPPD_df.geometry, crs = {'init': 'epsg:4326'}) 
    DPPD_df['Slope Score'] = DPPD_df['Slope Score'].astype('float')
    DPPD_df = gpd.GeoDataFrame(DPPD_df, geometry = DPPD_df.geometry, crs = {'init': 'epsg:4326'}) 
    DPPD_df.to_file('C:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\DPPD_Jesse\\'+ name + '\\result\\DPPD_'+ name +str(beginyear) +'-' + str(endyear)+level+'.geojson', driver="GeoJSON") 


    if col_name == 'Dist_Name':
        word = 'district level'
    elif col_name == 'Mandal_Nam':
        word = 'mandal level'
    else:
        word = '10 km grid'

    text = 'Average ' + name + ' values ' + 'on ' + level + ' level' 
    DPPD_df.plot(column = 'Averages', 
                        legend = True, 
                        figsize = [20,10],\
                        legend_kwds = {'label': 'Average ' + name }, 
                        cmap = 'RdYlGn_r')
    plt.title(text)
    os.chdir('c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\DPPD_Jesse\\'+name+'\\result')
    plt.savefig(text + '.png', bbox_inches='tight')
    plt.show()

    #Define text for the plots
    text = 'Changes ' + name + ' 2015-'+ str(endyear) + ' ' + word
    ranges = max(abs(DPPD_df['Slope Score'].min()), (DPPD_df['Slope Score'].max()))
    vmin, vmax, vcenter = ranges*-1 , ranges, 0
    norm = TwoSlopeNorm(vmin= vmin , vcenter=vcenter, vmax= vmax) 
    # create a normalized colorbar
    cmap = 'RdYlGn_r'
    cbar = plt.cm.ScalarMappable(norm=norm, cmap=cmap)
    DPPD_df.plot(column = 'Slope Score', 
                        legend = True, 
                        figsize = [20,10],\
                        legend_kwds = {'label': 'Deviance'}, 
                        cmap = 'RdYlGn_r',
                        norm = norm)
    plt.title(text)
    os.chdir('c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\DPPD_Jesse\\'+name+'\\result')
    plt.savefig(text + '.png', bbox_inches='tight')
    plt.show()

    os.chdir('c:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\DPPD_Jesse\\Fires\\results')
    DPPD_Fires = pd.read_csv('DPPD_Fires_'+str(beginyear) + '-' +str(endyear)+ level +'.csv', index_col = 0)
    DPPD_Fires.columns = ['index', 'Slope Score Fires', 'geometry']
    return(DPPD_Fires)

def save_dicra(DPPD_df, boundaries, format, file_name, level):
    '''Save the file in the right format for on the Dicra platform: mandal or district based'''
    del DPPD_df['geometry']

    if level == 'district':
        new_df = DPPD_df.merge(boundaries[['Dist_Name', 'index']], on = ['index'])
        new_df = new_df.merge(format, on='Dist_Name')

    elif level == 'mandal':
        new_df = DPPD_df.merge(boundaries[['Dist_Name', 'Mandal_Nam', 'index']], on = ['index'])
        new_df = new_df.merge(format, on=[['Dist_Name', 'Mandal_Nam']])

    del new_df['index']

    new_df = gpd.GeoDataFrame(new_df, geometry = new_df.geometry, crs = {'init': 'epsg:4326'}) 
    new_df.to_file('C:\\Users\\Jesse\\OneDrive\\Documenten\\Master BAOR\\Thesis\\GitHub\\dicra\\analytics\\sandbox\\notebooks\\crop_fires\\DPPD_Jesse\\Fires\\results\\'+ file_name +'.geojson', driver="GeoJSON") 
    print('File is saved.')