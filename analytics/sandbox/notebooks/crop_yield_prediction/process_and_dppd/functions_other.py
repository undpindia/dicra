# Import packages
from osgeo import gdal
import os
import numpy as np
import rasterio
import re

# This function creates GeoTIFFs representing the monthly averages 
# NOTE: Files are in format as YYYY-MM-DD
def monthly_averages(folder_path, dest_path, beginyear, endyear):
    file_names = os.listdir(folder_path) # contains all filenames within the selected folder
    months = ['-01-', '-02-', '-03-', '-04-', '-05-', '-06-', '-07-', '-08-', '-09-', '-10-', '-11-', '-12-']
    for year in range(beginyear,endyear+1):
        for m in months:
            year_month = str(year) + m
            group = list(filter(lambda x: year_month in x, file_names))
            n = len(group) # number of images within group
            if n != 0: 
                images = []
                val_array = []
                bin_array = []

                for j in range(n):
                    images.append(gdal.Open(folder_path + group[j])) # Open each of the n images
                    val_array.append(images[j].GetRasterBand(1).ReadAsArray().flatten())  # Read each of the n images as an array
                    
                col = images[0].RasterXSize # number of columns
                rows = images[0].RasterYSize # number of rows
                driver = images[0].GetDriver()
                nodata_value = images[0].GetRasterBand(1).GetNoDataValue() # value which has been assigned for the nodata
                
                for k in range(n):
                    bin_array.append(np.where(val_array[k] == nodata_value, 1, 0)) # For each image, create binary array where value is 1 if nodata pixel, 0 otherwise

                sum_counts = sum(bin_array) # For each pixel, we count the number of nodata values
                numbers = n - sum_counts # number of times we have data values per pixel
                no_data = np.where(sum_counts == n, 1, 0) # 1 if no data available for particular pixel, 0 otherwise

                # If numbers is 0 for a particular pixel, then we do not have any data on that pixel
                numbers = np.where(numbers == 0, 1, numbers) # Set to 1 as we can not divide by 0

                val_sum = sum(val_array) # Sum all values
                avg = (val_sum - sum_counts * nodata_value + no_data * nodata_value) / numbers # Calculate the average-data
                avgdataMatrix= avg.reshape(rows,col)

                # Create a new raster to save the average-values
                param = re.search('(.*)_', group[0]).group(1)
                raster_avg = driver.Create(dest_path + param + '_' + year_month[:-1] + ".tif", col, rows, 1, gdal.GDT_Float32)

                # Copy the properties of the original raster
                raster_avg.SetGeoTransform(images[0].GetGeoTransform())
                raster_avg.SetProjection(images[0].GetProjection())

                # Add the average values to newly created raster
                raster_avg.GetRasterBand(1).WriteArray(avgdataMatrix)
                raster_avg.GetRasterBand(1).SetNoDataValue(nodata_value)

                # Close raster
                raster_avg = None
                del raster_avg