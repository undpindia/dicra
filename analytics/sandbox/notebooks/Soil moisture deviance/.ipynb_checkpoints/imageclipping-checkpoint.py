import os 
from osgeo import gdal

input_path = "D:\\Soil Moisture NASA\\"
output_path = "D:\\Soil Moisture Telangana\\"

global_dataset = [ds for ds in os.listdir(input_path) if ds[-4:] == '.tif']
print("Imported", len(global_dataset), "items")

telangana_shapefile = "C:\\Users\\007sh\\Desktop\\UNDP\\"


for data in global_dataset:
    options = gdal.WarpOptions(cutlineDSName=telangana_shapefile, cropToCutline=True)
    output = gdal.Warp(srcDSOrSrcDSTab=input_path+data, destNameOrDestDS= output_path + data[:-4] + ".tif", options = options)

print("Image clipping complete.")