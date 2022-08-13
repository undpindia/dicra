In this folder one can find the results of the Data Powered Positve Deviance. 
DPPD_Final_FRP_Fires.ipynb shows the deviances based on the Fire Radiative Power and DPPD_Final_Count_Fires.ipynb shows the deviances based on the amount of fires.

In both files we make use of the Seasonal Trend Decomposition using LOES (STL) to obtain trend values and fit a linear regression line to these points to obtain the deviant scores.

The following file is necessary to have:
- fires_data_classified.csv : Shows the classified agricultural fires

Also atleast one boundary file of interest:
- telangana_shapefile.geojson : Shape file of Telangana
- District_Boundary.shp : Shape file of the districts in Telangana
- mandal_boundaries.shp : Shape file of the mandals in Telangana
- telangana_1km_grid.geojson : Shape file of 1 km grids in Telangana
- telangana_10km_grid.geojson: Shape file of 10 km grids in Telangana
