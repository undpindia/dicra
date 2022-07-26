The aim of this folder is to preprocess the parameter Land Surface Temperature (LST) for states Telangana and Karnataka. 

We derive LST data from Google Earth Engine via [ImageCollection "MODIS/061/MOD11A1"](https://doi.org/10.5067/MODIS/MOD11A1.061). 
The data is provided as daily images of 1km resolution ranging from 2000-02-24 up to now. We select the layer describing the Daytime Land Surface Temperature.
Besides, we use data ranging from 2016-2019.

The python code 'GEE_tif_LST.ipynb' is used to save the Land Surface Temperature as GeoTIFFs covering the states Telangana and Karnataka. 
Then, python code 'shape_LST.ipynb' is used to create separate GeoTIFFs for Telangana as well as Karnataka. 
Finally, 'rescale_LST.ipynb' translates the digital numbers to physical values (Kelvin) such that these numbers immediately make sense.

