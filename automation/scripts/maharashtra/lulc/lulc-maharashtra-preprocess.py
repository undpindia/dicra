import time
import subprocess as subp
import os
from osgeo import gdal, gdal_array
from datetime import datetime, timedelta

statebase = '/nfsdata/lulc/maharashtra'
scriptbase= statebase + '/process'
boundryfile = statebase + "/tsdm/District_Boundary.shp"

year = 2017

basepath='LULC_'+str(year)+'/'
arr = os.listdir(basepath)

cmd= "gdal_merge.py -of GTiff -co TILED=YES -co COMPRESS=DEFLATE -co ZLEVEL=9 -co PREDICTOR=2 -o LULC_"+str(year)+".tif"
for i in arr:
    #cmd="gdal_translate clipped/"+str(i)+" LULC-"+str(year)+"/"+str(i)+" -co COMPRESS=LZW -co ZLEVEL=9 -co TILED=YES"
    cmd = cmd+" "+basepath+i
print(cmd)
try:
    subp.check_call(str(cmd), shell=True)
except:
    print("end")
time.sleep(1)

cmd="gdalwarp -dstnodata -9999 -cutline "+ boundryfile +" -crop_to_cutline merged.tif LULC_"+str(year)+".tif -co TILED=YES -co COMPRESS=DEFLATE -co ZLEVEL=9 -co PREDICTOR=2"
print(cmd)
try:
    subp.check_call(str(cmd), shell=True)
except:
    print("end")
time.sleep(1)
'''
cmd="rm -r LULC_"+str(year)+" merged.tif"
print(cmd)
try:
    subp.check_call(str(cmd), shell=True)
except:
    print("end")
'''