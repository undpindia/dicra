import os
import time
import subprocess as subp

basepath='/home/ubuntu/NDVI_FILES_2020/'
arr = os.listdir('/home/ubuntu/NDVI_FILES_2020')
for i in arr:
    cmd="gdalwarp -of GTIFF  -r cubic -t_srs '+proj=longlat +datum=WGS84 +no_defs'"+" "+basepath+str(i)+" projected/"+str(i)
    print(cmd)
    try:
        subp.check_call(str(cmd), shell=True)
    except:
        print("end")
    time.sleep(1)