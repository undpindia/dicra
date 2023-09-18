from pydantic import BaseModel
from pydantic.types import Json,Dict

class Gettrend(BaseModel):
    geojson:Dict
    startdate:str
    enddate:str
    layer_id:int
    
class Getpointtrend(BaseModel):
    latitude:str
    longitude:str
    startdate:str
    enddate:str
    layer_id:int