from pydantic import BaseModel
from pydantic.types import Json,Dict

class Getlulc(BaseModel):
    geojson:Dict
    layer_id:int
    
class Getlulctrend(BaseModel):
    geojson:Dict
    layer_id:int
