In this folder one can find the results of the Data Powered Positve Deviance for multiple features:
(Note: the map Data contains the grid files of Telangana on 10 and 1 km resolution)

- Fires: DPPD_Fires.ipynb shows the deviances based on the Fire Radiative Power (MW) and the amount of fires.
- NO2: NO2.ipynb shows deviances based on the Nitrogen Dioxide values (Dobson Units) 
- PM2.5: PM2.5.ipynb shows deviances based on the Particular Matter 2.5 (ug/m3)
- ST: ST.ipynb shows deviances based on Soil Temperature (Celcius)

For both quantifiers we make use of the Seasonal Trend Decomposition using LOES (STL) to obtain trend values and fit a linear regression line to these points to obtain the deviant scores.

Also atleast one boundary file of interest:
- TL_state_shapefile_for_clip.geojson : Shape file of Telangana
- District_Boundary.shp : Shape file of the districts in Telangana
- mandal_boundaries.shp : Shape file of the mandals in Telangana
- telangana_1km_grid.geojson : Shape file of 1 km grids in Telangana
- telangana_10km_grid.geojson: Shape file of 10 km grids in Telangana

We also load in the following to files:
- TS_mandal_boundary.json
- TS_district_boundary.json
These are the right formats for on the Dicra platform, results of this can be found in the Preprocessing_Data_Dicra/Data_Dicra map