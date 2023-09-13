import geopandas as gpd 
import rasterio
from rasterio.plot import show
import rasterstats
import matplotlib.pyplot as plt
import os 
from osgeo import gdal
import numpy as np
from os.path import exists

def image_process(year):
    input_path = "C://Users//007sh//Desktop//UNDP//SoilMoistureMaharashtra//"
    dataset = [ds for ds in os.listdir(input_path) if ds[-4:] == '.tif']
    #print(dataset)
    image_name="NASA_USDA_SMAP_SM"+str(year)
    yearly_data = []

    # Formatting the image path to find them
    for i in range(1,13):
        monthly_data = []
        if i < 10:
            month_name = ("0"+str(i))
            for j in range(1,32):
                if j < 10:
                    day_name = "0"+str(j)
                    if(j+2 < 10): 
                        d_2 = "0"+str(j+2)
                    else :
                        d_2 = str(j) 
                    day_image = input_path+image_name+month_name+day_name+"_"+str(year)+month_name+d_2
                    
                else:
                    day_name = str(j)
                    if(j+2 < 10): 
                        d_2 = "0"+str(j+2)
                    else :
                        d_2 = str(j) 
                    day_image = input_path+image_name+month_name+day_name+"_"+str(year)+month_name+d_2
                #print(day_image)
                file_exists = exists(day_image+".ssm.tif")
                if(file_exists == True):
                    monthly_data.append(day_image+".ssm.tif")
                    #print("true")
        else:
            month_name = (str(i))
            for j in range(1,32):
                if j < 10:
                    day_name = "0"+str(j)
                    if(j+2 < 10): 
                        d_2 = "0"+str(j+2)
                    else :
                        d_2 = str(j+2)   
                    day_image = input_path+image_name+month_name+day_name+"_"+str(year)+month_name+d_2
                else:
                    day_name = str(j)
                    if(j+2 < 10): 
                        d_2 = "0"+str(j+2)
                    else :
                        d_2 = str(j+2) 
                    day_image = input_path+image_name+month_name+day_name+"_"+str(year)+month_name+d_2
                    print(day_image)
                file_exists = exists(day_image+".ssm.tif")
                if(file_exists == True):
                    monthly_data.append(day_image+".ssm.tif")
                    #print("true")
        yearly_data.append(monthly_data)
        #print(monthly_data)

    #get mean of monthly data
    monthly_mean_data = []
    for month in yearly_data:    
        monthly_data = []
        for image in month:
            img = gdal.Open(image)
            imgarray = np.array(img.GetRasterBand(1).ReadAsArray())
            monthly_data.append(imgarray)
            #print(monthly_data)
        
        if len(monthly_data) != 0:
            monthly_mean=np.mean(monthly_data,axis = 0)
        else:
            continue
        
        if np.isnan(monthly_mean.all()) != True:
            monthly_mean_data.append(monthly_mean)

    #print(len(monthly_mean_data))
    sample_image = gdal.Open(r"SoilMoistureMaharashtra//NASA_USDA_SMAP_SM20150402_20150404.ssm.tif")
    cols   = sample_image.RasterXSize
    rows  = sample_image.RasterYSize
    driver = sample_image.GetDriver()
    trans = sample_image.GetGeoTransform()
    proj=sample_image.GetProjection()
    
    for month in range(len(monthly_mean_data)):
        #print("Month is::", monthly_mean_data[month])
        
        if month < 9:
            month_name = "MahaMonthlydata//NASA_USDA_SMAP_SM"+str(year)+"0"+str(month+1)+".tif"
        else:
            month_name = "MahaMonthlydata//NASA_USDA_SMAP_SM"+str(year)+str(month+1)+".tif"

        outDs = driver.Create(month_name, cols, rows, 1, gdal.GDT_Float32)
        outBand = outDs.GetRasterBand(1)
        outBand.SetNoDataValue(-999)
        outBand.WriteArray(monthly_mean_data[month])
        outDs.SetProjection(proj)
        outDs.SetGeoTransform(trans)
        outDs.FlushCache()

    print("processing complete for the year", year)


for year in range (2015, 2023):
    image_process(year)