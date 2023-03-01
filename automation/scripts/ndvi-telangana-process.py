import time
import subprocess as subp

from osgeo import gdal, gdal_array
from datetime import datetime, timedelta


#Enter path of downloaded files
basepath='GEE_NDVItifs_scaled/'

if 'projected' not in os.listdir():
    os.mkdir('projected')
else:
    print('directory exists')

arr = os.listdir('GEE_NDVItifs_scaled')
for i in arr:
    cmd="gdalwarp -of GTIFF  -r cubic -t_srs '+proj=longlat +datum=WGS84 +no_defs'"+" "+basepath+str(i)+" projected/"+str(i)
    print(cmd)
    try:
        subp.check_call(str(cmd), shell=True)
    except:
        print("end")
    time.sleep(1)

# Open band 1 as array
arr = os.listdir('projected/')

if 'recalculated' not in os.listdir():
    os.mkdir('recalculated')
else:
    print('directory exists')

for i in arr:
    ds = gdal.Open('projected/'+str(i))
    b1 = ds.GetRasterBand(1)
    arr_q = b1.ReadAsArray()
   # ndv = 1
    # apply scale factor
    data = arr_q*(0.0001)			#RECALCULATION FORMULA WILL DIFFER FOR EACH DATASET
    #data = np.where(data > 1,-9999, data)
    #data=np.where(data<0,-9999,data)
    print(str(i))
    # save array, using ds as a prototype
    output="recalculated/"+str(i)
    gdal_array.SaveArray(data.astype("float32"), output, "GTIFF", ds)

    ds = None

basepath='recalculated/'
arr = os.listdir('recalculated')

if 'clipped' not in os.listdir():
    os.mkdir('clipped')
else:
    print('directory exists')
    
for i in arr:
    cmd="gdalwarp -dstnodata -9999 -cutline tsdm/District_Boundary.shp -crop_to_cutline "+basepath+str(i)+" clipped/"+i
    print(cmd)
    try:
        subp.check_call(str(cmd), shell=True)
    except:
        print("end")
    time.sleep(1)

arr = os.listdir('clipped/')

if 'cog_ndvi' not in os.listdir():
    os.mkdir('cog_ndvi')
else:
    print('directory exists')

for i in arr:
    cmd="gdal_translate clipped/"+str(i)+" cog_ndvi/"+str(i)+" -co COMPRESS=LZW -co TILED=YES"
    print(cmd)
    try:
        subp.check_call(str(cmd), shell=True)
    except:
        print("end")
    time.sleep(1)

cmd="rm -r GEE_NDVItifs_scaled clipped projected recalculated"
print(cmd)
try:
    subp.check_call(str(cmd), shell=True)
except:
    print("end")
    
    
#PREPROCESSED FILE WILL BE IN FINAL COG FOLDER
