# Import packages
from osgeo import gdal
import os
import numpy as np
import rasterio
import re
import rasterstats
from rasterio.warp import reproject, Resampling, calculate_default_transform

# This function adjusts the resolution of the higher resolution GeoTIFF (1) to the resolution of the lower resolution GeoTIFF (2) and saves it as a new GeoTIFF
def adjust_resolution(highres_tiff, lowres_tiff, lowered_tiff, nodata_value):
    # open the higher resolution GeoTIFF (1)
    with rasterio.open(highres_tiff) as src:
        src_transform = src.transform
        
        # open the lower resoltuion GeoTIFF (2)
        with rasterio.open(lowres_tiff) as lowres_tiff:
            dst_crs = lowres_tiff.crs
            
            # Calculate the output transform matrix
            dst_transform, dst_width, dst_height = calculate_default_transform(
                src.crs,     # CRS of higher resolution GeoTIFF (1)
                dst_crs,     # CRS of lower/desired resolution GeoTIFF (2)
                lowres_tiff.width,   # width of lower/desired resolution GeoTIFF (2)
                lowres_tiff.height,  # height of lower/desired resolution GeoTIFF (2)
                *lowres_tiff.bounds,  # unpacks outer boundaries (left, bottom, right, top) of lower/desired resolution GeoTIFF (2)
            )

        # Set properties for new/desired GeoTIFF
        dst_kwargs = src.meta.copy() # copies the metadata of the original higher resolution GeoTIFF (1)
        dst_kwargs.update({"crs": dst_crs,
                           "transform": dst_transform,
                           "width": dst_width,
                           "height": dst_height,
                           "nodata": nodata_value}) # updates part of the metadata such that it can be transformed to the desired resolution
        print("Coregistered to shape:", dst_height,dst_width,'\n Affine',dst_transform)
        # open the new/desired GeoTIFF such that we can adjust it
        with rasterio.open(lowered_tiff, "w", **dst_kwargs) as dst:
            # iterate through bands and write using reproject function
            for i in range(1, src.count + 1):
                reproject(
                    source=rasterio.band(src, i),
                    destination=rasterio.band(dst, i),
                    src_transform=src.transform,
                    src_crs=src.crs,
                    dst_transform=dst_transform,
                    dst_crs=dst_crs,
                    resampling=Resampling.mode) # mode resampling method

# This function sets the pixel value to nodata value when the pixel belongs to another category than given
def mask(file_path, mask_path, paddy):
    tiff_open = gdal.Open(file_path,1) # open the GeoTIFF we want to mask
    band = tiff_open.GetRasterBand(1) # Select the band
    tiff_array = tiff_open.ReadAsArray() # Assign raster values to a numpy nd array

    mask_open = gdal.Open(mask_path) # open the GeoTIFF for masking
    mask_array = mask_open.ReadAsArray() # Assign raster values to a numpy nd array

    ndval = band.GetNoDataValue() # value which has been assigned for the nodata
    # Flooded vegetation (4) and Crops (5)
    if paddy == True:
        tiff_array[(mask_array != 4) & (mask_array != 5)] = ndval # Set pixel value to nodata value when the pixel belongs to another category than category
    if paddy == False:
        tiff_array[mask_array != 5] = ndval # Set pixel value to nodata value when the pixel belongs to another category than category

    # Write and close datasets
    band.WriteArray(tiff_array)
    tiff_open.FlushCache()
    band = None
    ds = None
    del tiff_array
    del mask_array
    mask_open = None

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