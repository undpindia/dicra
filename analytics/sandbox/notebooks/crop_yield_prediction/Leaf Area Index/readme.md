The aim of this folder is to create Cloud Optimized GeoTIFF files for Leaf Area Index that can be used to improve the DiCRA platform.

We derive LAI 300metres data from: https://land.copernicus.eu/global/products/lai

This data provides a near real time estimate (RT0) and three consolidated modes. These modes are calculated after 10 days (RT1), 20 days (RT2) and 60 days (RT6). This is included in the filename. Subsequently, the filename includes the date, which is the end date of a 10-daily period. The compositing window ranges from up to 210 days before the date and up to 60 days afterwards (depending on the consolidated mode). For more information on the background and realization of the Sentinel-3/OLCI Collection 300m LAI Version 1.1, we refer to the [LAI Characteristics](https://land.copernicus.eu/global/products/lai). 

The downloaded data contains 493 GeoTIFF files (LAI_images.zip), where as mentioned before the filename includes the date and the consolidation mode. In 'LAI_Telangana.ipynb', we clip the geoTIFF files such that the newly derived GeoTIFF files (LAI_Telangana.zip) only contain the Leaf Area Index for the state Telangana. 

For formatting these GeoTIFF files to Cloud Optimized GeoTIFF files, we run the following command in the OSGeoW4 Shell:

for %N in (C:/Users/mieke/Documents/COG_files/LAI/LAI_geotiff/*.tiff) DO gdal_translate C:/Users/mieke/Documents/trialmap/geotiff/%~nN.tiff  C:/Users/mieke/Documents/COG_files/LAI/LAI_cog/%~nN.tiff -co COMPRESS=LZW -co TILED=YES

Note that we use the OSGeoW4 Shell as we are working on a Windows device. The newly derived Cloud Optimized GeoTIFF files (LAI_Telangana_COG.zip) are available upon request do to size limitations.