import geopandas as gpd
import pandas as pd
import rasterio
from rasterio import mask
# import shapely
from shapely.geometry import Polygon, Point, shape
from shapely.ops import cascaded_union
import shapely.speedups
import numpy as np
import json
import configparser
from pprint import pprint
from rasterstats import zonal_stats, point_query
import rioxarray
from affine import Affine

shapely.speedups.enable()

statebase = '/nfsdata/rwi/jharkhand'
scriptbase = statebase + '/download'
basepath = statebase + '/base'
districtboundryfile = statebase + "/tsdm/District_Boundary.shp"
mandalboundryfile = statebase + "/tsdm/Mandal_Boundary.shp"

# Reading the data
# We read district boundaries of the state from district_boundary.json file, ind_pak_relative_wealth_index.csv contains relative wealth index data of the countries, and ind_ppp_2020_1km_Aggregated contains estimates of spatial distribution of population with 1km resolution.

# Source:
# Population estimates: https://data.humdata.org/dataset/eafac897-aa94-479d-9cc1-c7105f5d0aad/resource/581830b1-4989-47ab-ba6f-aadbef810575
# RWI: https://data.humdata.org/dataset/relative-wealth-index/resource/977923ab-c65a-4203-b216-e4b7483d56a5


df_district_boundaries = gpd.read_file(boundryfile)
relative_wealth_data = pd.read_csv('data/ind_pak_relative_wealth_index.csv')
df_district_boundaries['Dist_Name'].nunique()

india_worldpop_raster_2020 = rasterio.open('data/ind_ppp_2020_1km_Aggregated_UNadj.tif')
print('No. of bands:',(india_worldpop_raster_2020.count))
# Reading the first band, filtering negative raster values and visualise data with matplotlib
india_worldpop_raster_2020_tot = india_worldpop_raster_2020.read(1)
india_worldpop_raster_2020_tot[india_worldpop_raster_2020_tot<0] = None

india_worldpop_raster_2020_nonzero = india_worldpop_raster_2020_tot[india_worldpop_raster_2020_tot>0]
population_worldpop = india_worldpop_raster_2020_nonzero[india_worldpop_raster_2020_nonzero > 0].sum()
print('Total population - jharkhand (2020): ',round(population_worldpop/1000000000,2),'billion')

# Get Population function
# Function to get district wise population estimates using a mask layer to mask a district and taking it's aggregated sum.

def get_population_count(vector_polygon,raster_layer):
    gtraster, bound = rasterio.mask.mask(raster_layer, [vector_polygon], crop=True)
    pop_estimate = gtraster[0][gtraster[0]>0].sum()
    return (pop_estimate.round(2))

# %%time
# Calling the get_population_count function to get district wise populations. 
df_district_boundaries['population_count_wp'] = df_district_boundaries['geometry'].apply(get_population_count,raster_layer=india_worldpop_raster_2020)
# Preparing the data by rounding off the values to make sure they are integers and then sorting the data frame by population
district_population = df_district_boundaries.groupby(['Dist_Name'])['population_count_wp'].sum().round().reset_index().sort_values(by='population_count_wp')

# %%time
# Function to convert dataframe into points
def convert_Point(facebook_relative_wealth):
    return Point(facebook_relative_wealth['longitude'],facebook_relative_wealth['latitude'])

relative_wealth_data['geometry'] = relative_wealth_data[['latitude','longitude']].apply(convert_Point,axis=1)
relative_wealth_data = gpd.GeoDataFrame(relative_wealth_data)
relative_wealth_data.head(2)

#Function to get mean values of RWI in a region.
def get_rwi_mean(vector_polygon,vector_layer):
    pip_mask = vector_layer.within(vector_polygon)
    pip_data = vector_layer.loc[pip_mask]
    mean_val = round(pip_data['rwi'].mean(),2)
    return(mean_val)

#Function to get median values of RWI in a region.
def get_rwi_median(vector_polygon,vector_layer):
    pip_mask = vector_layer.within(vector_polygon)
    pip_data = vector_layer.loc[pip_mask]
    mean_val = round(pip_data['rwi'].median(),2)
    return(mean_val)
#Add column containing RWI mean of a district in the datframe.
df_district_boundaries['rwi_mean'] = df_district_boundaries['geometry'].apply(get_rwi_mean,vector_layer=relative_wealth_data) 
district_average_rwi = df_district_boundaries.groupby(['Dist_Name'])['rwi_mean'].mean().reset_index().sort_values(by='rwi_mean')

# Merge 2 data frames district_average_rwi containing mean RWI values of the district and district population containing population of that district
df_combined = pd.merge(district_average_rwi,district_population,on=['Dist_Name'])

#get weighted values of population and mean RWI
df_combined['weighted'] = df_combined['population_count_wp']*df_combined['rwi_mean']

#Sort the dataframe with descending order of population weighted mean values
df_combined.sort_values(by='weighted').to_excel('result/rwi_average.xlsx')

# Add column containing RWI median of a district in the datframe
df_district_boundaries['rwi_median'] = df_district_boundaries['geometry'].apply(get_rwi_median,vector_layer=relative_wealth_data)
district_median_rwi = df_district_boundaries.groupby(['Dist_Name'])['rwi_median'].mean().reset_index().sort_values(by='rwi_median')

# Merge 2 data frames district_median_rwi containing median RWI values of the district and district population containing population of that district
df_combined = pd.merge(district_median_rwi,district_population,on=['Dist_Name'])

#get weighted values of population and mean RWI
df_combined['weighted'] = df_combined['population_count_wp']*df_combined['rwi_median']

#Sort the dataframe with descending order of population weighted median values
df_combined.sort_values(by='weighted').to_excel('result/rwi_median.xlsx')
adm_name = gpd.read_file(boundryfile)  #Mandal (an administrative boundary) Shapefile
relative_wealth_data = pd.read_csv('data/ind_pak_relative_wealth_index.csv') #importing the values again because the original values were altered

#Converting fire points into dataframe
relative_wealth_data = gpd.GeoDataFrame(relative_wealth_data, geometry=gpd.points_from_xy(relative_wealth_data.longitude,relative_wealth_data.latitude),crs=4326)

rwi_jharkhand = relative_wealth_data.clip(adm_name)                   #Clipping fire points with Telangana boundaries


# Creating Geospatial data containing RWI values for the region
# We use rasterio and rioxarray, python libraries to process geospatial data to create dataset of Relative Wealth Index values. The produced dataset is stored and made available for use. Here: https://dicra.undp.org.in/

df2 = rwi_jharkhand[['latitude','longitude']]                     #create a dataframe with lat lon values of rwi dataframe
df2['rwi'] = list(rwi_jharkhand['rwi'])                           #add column of rwi values
da = df2.set_index(['latitude', 'longitude']).to_xarray()        #convert new dataframe to xarray
da = da.set_coords(['latitude', 'longitude'])                    #set lat and lon as coordinates

da.fillna(-9999.0)                                               #fill None values
da = da.rename({'longitude': 'x','latitude': 'y'})               # change lon lat to x  y for exporting xarray to tif

new_tif_array = np.array(da['rwi'])
new_tif_array = np.fliplr(np.flip(new_tif_array))
#da['rwi'] = new_tif_array

da.rio.to_raster('result/RWI.tif', tiled=True)                                #dump xarray to 

crs = rasterio.crs.CRS({"init": "epsg:4326"})    # or whatever CRS you know the image is in    


# flip to fix Affine in correct order otherwise zonal_stats gives error
def flipud(raster, affine):
    raster = np.flipud(raster)
    affine = Affine(affine.a,affine.b,affine.c,affine.d,-1 * affine.e,affine.f + (affine.e * (raster.shape[0] - 1)),)
    return raster, affine

with rasterio.open('result/RWI.tif', mode='r+') as src:     
    #src.transform = transform
    affine = src.transform
    raster = src.read(1)

    raster, affine = flipud(raster, affine)
    
    src.write(raster, 1)
    src.transform = affine
    src.crs = "epsg:4326"
    src.close()
def meanvalues(geojson, tif, variable_name):
    
    data = gpd.read_file(geojson)  #Mandal (an administrative boundary) Shapefile
    #data = data.sort_values(by=['Mandal_Nam'])
    data['index'] = data.index
    
    mean_list = []
    for j in range(len(data)):                #iterating all rows of dataframe to get point info

        stats = zonal_stats(data.iloc[j].geometry, tif, stats="*", categorical=True)         #getting statistics from the raster point 
        i = stats[0]                                                                          #storing statsistical dictionary in a value
        mean = i['median']
        mean_list.append(mean)
    
    data[variable_name] = mean_list
    return data
mandal_geojson = mandalboundryfile #getting mandal values of the region
dist_geojson = districtboundryfile #getting district values of the region

#create mandal dataset and store it in json file.
mandal_geojson = meanvalues(mandal_geojson, 'result/RWI.tif', 'rwi')
mandal_geojson.to_file('result/RWI_mandal.json')

#create district dataset and store it in json file.
dist_geojson = meanvalues(dist_geojson, 'result/RWI.tif', 'rwi')
dist_geojson.to_file('result/RWI_district.json')
