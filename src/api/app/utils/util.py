from datetime import datetime
from shapely.geometry import shape
import time
def toUnix(datestring):
    unixtime=time.mktime(datetime.strptime(datestring,'%d-%m-%Y').timetuple())
    return int(unixtime*1000)
def getcentroid(polygon_feature):
    """
    Function for getting centroid of a polygon feature
    Parameters
    polygon_feature - Polygon feture object from the geojson
    """
    polygon_shape=shape(polygon_feature)
    centrod_of_polygon=polygon_shape.centroid
    return(centrod_of_polygon)
def checknodata(filedate,val):
    print(type(val))
    if val is None:
      return([filedate,0])
    else:
      return([filedate,round(val,2)])