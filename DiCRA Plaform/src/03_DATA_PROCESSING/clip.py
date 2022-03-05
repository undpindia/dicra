import os
import time
import subprocess as subp

basepath='/home/ubuntu/data-processing/recalculated'
arr = os.listdir('/home/ubuntu/data-processing/recalculated')
for i in arr:
    cmd="gdalwarp -dstnodata -9999 -cutline TSDM/District_Boundary.shp -crop_to_cutline "+basepath+"/"+str(i)+" clipped/"+i
    print(cmd)
    try:
        subp.check_call(str(cmd), shell=True)
    except:
        print("end")
    time.sleep(1)
