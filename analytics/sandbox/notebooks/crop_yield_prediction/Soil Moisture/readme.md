The aim of this folder is to preprocess the parameter Surface Soil Moisture (SSM) for states Telangana and Karnataka.

We derive SSM data from Google Earth Engine via ImageCollection "NASA_USDA/HSL/SMAP10KM_soil_moisture". 
The data is provided as images of 10km resolution every three days ranging from 2015-04-02 up to now. However, we use data ranging from 2016-2019.

The python code 'GEE_tif_SSM.ipynb' is used to save the Land Surface Temperature as GeoTIFFs covering the states Telangana and Karnataka. 
Then, python code 'shape_SSM.ipynb' is used to create separate GeoTIFFs for Telangana as well as Karnataka. 
Finally, 'rescale_SSM.ipynb' sets the nodata values equal to -9999. Furthermore, the physical values for Soil Surface Moisture are given in mm.

