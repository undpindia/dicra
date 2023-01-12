This folder contains all functions and files needed to preprocess the data layers and calculate the Data Powered Positive Deviance (DPPD) for DiCRA. We briefly discuss each of the files within this folder.
- <b>functions_preprocessing.py:</b> This file contains all functions to preprocess the data. These functions are used for rescaling the data, setting the nodata value, cropping the images for the area of interest
- <b>functions_time_series.py:</b> This file contains all functions needed to run the DPPD analysis. One of these functions is used to create a dataframe containing the average values for the administrative boundary of interest. The rows represent a calendar date, the columns represent an administrative bound unit. The other functions are used to determine the trend scores, i.e., DPPD scores. They also visualize the results
- <b>data_download.ipynb:</b> Within this file we download the data available at Google Earth Engine
- <b>data_preprocess.ipynb:</b> This file runs the preprocessing functions on the downloaded data such that we obtain rescaled, cropped images with a nodata value of -9999
- <b>create_df.ipynb:</b> In this file, we create the dataframes on mandal and district level in the previously explained format 
- <b>dppd_computation.ipynb:</b> This file calculates the DPPD scores, visualizes the outcome and save it to geojson-files

Furthermore, this folder contains the following files:
- <b>functions_other.py:</b> this file contains all other functions. These functions are used for creating monthly images, crop masking
- <b>create_monthly_avg.py:</b> This file calculates the average parameter value over all images within a certain month. The result is saved as a new GeoTIFF such that we have monthly images to work with
