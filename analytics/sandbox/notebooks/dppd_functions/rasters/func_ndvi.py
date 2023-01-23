import pandas as pd
import os
import geopandas as gpd
import rasterio
from statsmodels.tsa.seasonal import STL
import numpy as np
from sklearn.linear_model import LinearRegression
import datetime as dt
import time
from rasterstats import zonal_stats

def ndvi_dppd(boundaries, index:int):

    #boundaries = boundary.head(10)
    #boundaries = boundaries.reset_index()
    directory = 'cog/'
    tiffs = os.listdir(directory)
    tiffs.sort()
    
    dates = [pd.to_datetime(tiff[:10].replace("_", "-")) for tiff in tiffs]
    dates_ordinal = [dt.datetime.toordinal(pd.to_datetime(tiff[:10].replace("_", "-"))) for tiff in tiffs]

    df = pd.DataFrame()

    dates = [pd.to_datetime(tiff[:10].replace("_", "-")) for tiff in tiffs]
    dates_ordinal = [dt.datetime.toordinal(date) for date in dates]
    mean_list = [zonal_stats(boundaries.iloc[index]["geometry"], directory+tiff, stats="mean")[0]['mean'] for tiff in tiffs]

    ndvi = pd.Series(mean_list, index=pd.to_datetime(dates), name="NDVI")

    res =[]
    for i in range(2022-2012):

        stl = STL(ndvi[i*23:(i+1)*23])
        res1 = stl.fit()
        res = res + list(res1.trend)
    df =pd.DataFrame()
    df['dates'] = dates_ordinal
    df['res'] = res

    df = df.dropna()
    #Set the data in the right format for Linear Regression
    if not df.empty:
        #Set the data in the right format for Linear Regression
        x = np.array(df['dates'])
        X = x.reshape(-1, 1)
        y = np.array(df['res'])
        y = y.reshape(-1, 1)

        #Perform Linear Regression and obtain the slope
        reg = LinearRegression().fit(X, y)
        y_pred_trend = reg.predict(X)
        slope, intercept = np.polyfit(x, y_pred_trend,1)
        return slope[0]

    else:
        return 0

      
import multiprocessing
from functools import partial
import time


if __name__ == '__main__':
#def dataframe_de(boundary):  
    start_time = time.time()

    
    boundary = gpd.read_file('Telangana_grid1km.geojson')
    #boundary = boundary.head(1000)
    boundary = boundary.reset_index()

    pool = multiprocessing.Pool()

    #func = partial(ndvi_dppd, boundary, tiffs, directory)

    results =[pool.apply_async(ndvi_dppd, args=(boundary, j)) for j in range(len(boundary))]

    #pool.map(func, iterable)
    pool.close()
    pool.join()


    print("--- %s seconds ---" % (time.time() - start_time))

    
    res = [p.get() for p in results]
    
    res = np.array(res)
    print(np.min(res))
    data_norm = np.where(res >= 0, res/np.max(res), -res/np.min(res))
    boundary['deviance'] = list(data_norm)
    boundary = boundary[['index','deviance','geometry']]
    #return res
    #return gpd.GeoDataFrame(boundary)
    gpd.GeoDataFrame(boundary).to_file('deviance_grid_ndvi.json')