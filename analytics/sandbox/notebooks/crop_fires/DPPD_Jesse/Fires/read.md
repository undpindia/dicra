In this folder one can find the results of the Data Powered Positve Deviance. 
DPPD_Fires.ipynb shows the deviances based on the Fire Radiative Power and the amount of fires.

For both quantifiers we make use of the Seasonal Trend Decomposition using LOES (STL) to obtain trend values and fit a linear regression line to these points to obtain the deviant scores.

The following file is necessary to have:
- fires_data_classified.geojson : Shows the classified agricultural fires

Also atleast one boundary file of interest:
- TL_state_shapefile_for_clip.geojson : Shape file of Telangana
- District_Boundary.shp : Shape file of the districts in Telangana
- mandal_boundaries.shp : Shape file of the mandals in Telangana
- telangana_1km_grid.geojson : Shape file of 1 km grids in Telangana
- telangana_10km_grid.geojson: Shape file of 10 km grids in Telangana

We also load in the following to files:
- TS_mandal_boundary.json
- TS_district_boundary.json



These are the right format for on the Dicra platform