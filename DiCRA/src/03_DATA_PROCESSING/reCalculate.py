import os
import numpy as np
from osgeo import gdal, gdal_array
import numpy.ma as ma

# Open band 1 as array
arr = os.listdir('projected/')
for i in arr:
    ds = gdal.Open('/home/ubuntu/data-processing/projected/'+str(i))
    b1 = ds.GetRasterBand(1)
    arr_q = b1.ReadAsArray()
    ndv = 1
    # apply equation
    data = (arr_q-50.0)/200.0
    data = np.where(data > 1,-9999, data)
    data=np.where(data<0,-9999,data)
    print(str(i))
    # save array, using ds as a prototype
    output="/home/ubuntu/Desktop/data-processing/recalculated/"+str(i)
    gdal_array.SaveArray(data.astype("float32"), output, "GTIFF", ds)

    ds = None
    
