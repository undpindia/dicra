import matplotlib.pyplot as plt
from soilgrids import SoilGrids
import geopandas as gpd
import os
import subprocess as subp
import time
from osgeo import gdal, gdal_array


#Every file type and state base folder should be set in the beginning of the program
statebase = '/nfsdata/soc/jharkhand'
scriptbase= statebase + '/process'
boundryfile = statebase + "/tsdm/District_Boundary.shp"
tifspath = statebase + '/download/SOCtifs'

#Enter path of downloaded files, always prefix the scriptbase path to avoid files getting generated in wrong folders
basepath=tifspath 
projfname = "projected"
projpath = scriptbase + "/"+projfname
recalfname = "recalculated"
recalpath = scriptbase + "/" + recalfname
clipfname = "clipped"
clippath = scriptbase + "/" + clipfname
cogfname = "cog_soc"
cogpath = scriptbase + "/" + cogfname


###Below code was commented due to hardcoded path string, I have re-written the lines below
#if 'projpath' not in os.listdir():
#    os.mkdir('projected')
#else:
#    print('directory exists')

if projfname not in os.listdir(scriptbase):
    os.mkdir(projpath)
else:
    print('projected directory exists')

#arr = os.listdir('GEE_NDVItifs_scaled') #Don't hardcode the path string in multiple lines, use a variable
arr = os.listdir(basepath)
for i in arr:
    #cmd="gdalwarp -of GTIFF  -r cubic -t_srs '+proj=longlat +datum=WGS84 +no_defs'"+" "+basepath+str(i)+" projected/"+str(i)
    cmd="gdalwarp -of GTIFF  -r cubic -t_srs '+proj=longlat +datum=WGS84 +no_defs'"+" "+basepath +"/"+str(i)+" " + projpath + "/"+str(i)
    print(cmd)
    try:
        subp.check_call(str(cmd), shell=True)
    except:
        print("end")
    time.sleep(1)

# Open band 1 as array
#arr = os.listdir('projected/')
arr = os.listdir(projpath)

###Below code was commented due to hardcoded path string, I have re-written the lines below
#if 'recalculated' not in os.listdir():
#    os.mkdir('recalculated')
#else:
#    print('directory exists')

if recalfname not in os.listdir(scriptbase):
    os.mkdir(recalpath)
else:
    print('recalculated directory exists')

for i in arr:
    #ds = gdal.Open('projected/'+str(i))
    ds = gdal.Open(projpath+'/'+str(i))
    b1 = ds.GetRasterBand(1)
    arr_q = b1.ReadAsArray()
   # ndv = 1
    # apply scale factor
    data = arr_q*(0.0001)			#RECALCULATION FORMULA WILL DIFFER FOR EACH DATASET
    #data = np.where(data > 1,-9999, data)
    #data=np.where(data<0,-9999,data)
    print(str(i))
    # save array, using ds as a prototype
    #output="recalculated/"+str(i)
    output=recalpath + "/"+str(i)
    gdal_array.SaveArray(data.astype("float32"), output, "GTIFF", ds)

    ds = None

#basepath='recalculated/'
#arr = os.listdir('recalculated')
arr = os.listdir(recalpath)

###Below code was commented due to hardcoded path string, I have re-written the lines below

#if 'clipped' not in os.listdir():
#    os.mkdir('clipped')
#else:
#    print('directory exists')


if clipfname not in os.listdir(scriptbase):
    os.mkdir(clippath)
else:
    print('clipped directory exists')
    
    
for i in arr:
    
    #cmd="gdalwarp -dstnodata -9999 -cutline tsdm/District_Boundary.shp -crop_to_cutline "+basepath+str(i)+" clipped/"+i
    cmd="gdalwarp -dstnodata -9999 -cutline " + boundryfile + " -crop_to_cutline "+recalpath+"/"+str(i)+ " " + clippath + "/"+i
    print(cmd)
    try:
        subp.check_call(str(cmd), shell=True)
    except:
        print("end")
    time.sleep(1)

#arr = os.listdir('clipped/')

arr = os.listdir(clippath)

###Below code was commented due to hardcoded path string, I have re-written the lines below

#if 'cog_ndvi' not in os.listdir():
#    os.mkdir('cog_ndvi')
#else:
#    print('directory exists')

if cogfname not in os.listdir(scriptbase):
    os.mkdir(cogpath)
else:
    print('cog_soc directory exists')


for i in arr:
    #cmd="gdal_translate clipped/"+str(i)+" cog_ndvi/"+str(i)+" -co COMPRESS=LZW -co TILED=YES"
    cmd="gdal_translate " + clippath + "/"+str(i)+ " " + cogpath + "/"+str(i)+" -co COMPRESS=LZW -co TILED=YES"
    print(cmd)
    try:
        subp.check_call(str(cmd), shell=True)
    except:
        print("end")
    time.sleep(1)

##Commented the remove action below
#cmd="rm -r GEE_NDVItifs_scaled clipped projected recalculated"
#print(cmd)
#try:
#    subp.check_call(str(cmd), shell=True)
#except:
#    print("end")
    
    
#PREPROCESSED FILE WILL BE IN FINAL COG FOLDER
