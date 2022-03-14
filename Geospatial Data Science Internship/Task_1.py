# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd 
import geopandas as gpd
import matplotlib.pyplot as plt

# Importing an GADM Shapefile and plotting it using GeoPandas
inmap = gpd.read_file(r'C:/Users/pkgp8/Desktop/Geopandas/gadm40_IND_shp/gadm40_IND_3.shp')
plt.figure(figsize=((10,8)))
plt.rcParams["figure.figsize"] = (10,8)
inmap.plot(edgecolor = 'black')

# Changing .geojson.txt to .shp to change the 
tnmap = gpd.read_file(r'C:/Users/pkgp8/Desktop/Geopandas/telangana_shapefile.geojson.txt')
tnmap.to_file(r'C:/Users/pkgp8/Desktop/Geopandas/telangana_shapefile.geojson.shp')
tnmap_s = gpd.read_file(r'C:/Users/pkgp8/Desktop/Geopandas/telangana_shapefile.geojson.shp')

#
tnmap_dis = gpd.read_file(r'C:/Users/pkgp8/Desktop/Geopandas/gadm40_IND_shp/District_Boundary.shp')
tnmap_dis.plot(edgecolor = 'black')

# Read the .csv file using Pandas 
telangana_fires = pd.read_csv('C:/Users/pkgp8/Desktop/Geopandas/gadm40_IND_shp/telangana_fires.csv')

# Obtain the Exact WKT
ESRI_WKT = 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]'

# Creating GeoPandas GeoDataFrame using the Pandas Dataframe 
fires_gdf = gpd.GeoDataFrame(telangana_fires , geometry = gpd.points_from_xy(telangana_fires['longitude'],telangana_fires['latitude'] ))
fires_gdf.plot(markersize = 1, figsize = (10,8))

# # Plot the figures side by side
plt.rcParams["figure.figsize"] = (10,8)
fig, (ax1, ax2) = plt.subplots(ncols = 2)
inmap.plot(ax = ax1)
tnmap_dis.plot(ax = ax2)

# Plotting multiple layers
fig, ax = plt.subplots(figsize = (10,8))
inmap.plot(ax = ax, cmap = 'hsv', edgecolor = 'black')
tnmap_dis.plot(ax = ax, color = 'none', edgecolor = 'green')
fires_gdf.plot(ax = ax, color = 'black', markersize = 1)

# Intersecting Layers
tn_fmap = gpd.overlay(inmap, tnmap_dis, how = 'intersection')
tn_fmap.plot(edgecolor = 'green')

 # Plotting multiple layers
fig, ax = plt.subplots(figsize = (10,8))
tn_fmap.plot(ax = ax, color = 'none', edgecolor = 'green')
fires_gdf.plot(ax = ax, color = 'red', markersize = 1)







"""
##Created on Sun Mar 13 06:38:15 2022

@author: Prajjwal Kumar
"""


"""
Created on Mon Mar 14 05:52:10 2022

@author: pkgp8
"""

