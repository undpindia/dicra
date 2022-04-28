from pydantic import BaseModel
from pydantic.types import Json,Dict

class Getlulc(BaseModel):
    geojson:Dict
class Getlulctrend(BaseModel):
    geojson:Dict
    parameter:int
