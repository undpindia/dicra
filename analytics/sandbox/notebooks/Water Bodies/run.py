import os
from osgeo import gdal
import numpy as np

#Dowload all datasets and keep it inside a folder named 'Downloads' 

# folder path
dir_path = 'Downloads/'

# list to store files
res = []

# Iterate directory
for path in os.listdir(dir_path):
    # check if current path is a file
    if os.path.isfile(os.path.join(dir_path, path)):
        res.append(path)

# iterate output file names 'c_gls_WB100_202102010000_GLOBE_S2_V1.0.1' to give output file names like this 'WB100_20210201.tif'
cnv = []
for i in res:
    cnv.append(i[6:20])

band = 'QUAL' # or 'WB'
#gdal translate will convert the netcdf(QUAL in below code )file to geotiff file 
#gdal warp is to clip geotiff with Region of Interest
for i in cnv:
        ds = gdal.Open("NETCDF:Downloads/"+str(i)+":"+band)
        ds = gdal.Translate(str(i+'_cnv.tif'), ds)
        ds = None
        print(str(i+'_cnv.tif')+' has been created')        
        
        OutTile = gdal.Warp(band+"/"+str(i+'_'+band+'.tif'),
                            str(i+'_cnv.tif'),
                            cutlineDSName='Telangana.shp',
                            cropToCutline=True,)

        OutTile = None
           print(str(i+'_'+band+'.tif')+' has been clipped') 
            
#Delete GeoTiff as it is too large
        os.remove(str(i+'_cnv.tif'))

'''
        x_size = 4894
        y_size = 4896
        num_bands = 1
        file_name = band+"/"+str(clip[i])

        data = np.ones((num_bands, y_size, x_size))
        driver = gdal.GetDriverByName('GTiff')
        data_set = driver.Create(file_name, x_size, y_size, num_bands,
        gdal.GDT_Float32,
        options=["TILED=YES",
        "COMPRESS=LZW",
        "INTERLEAVE=BAND"])

        for i in range(num_bands):
            data_set.GetRasterBand(i + 1).WriteArray(data[i])

            data_set.BuildOverviews("NEAREST", [2, 4, 8, 16, 32, 64])
            data_set = None
'''
