from pydantic import BaseModel
from pydantic.types import Json,Dict

class Gettrend(BaseModel):
    geojson:Dict
    startdate:str
    enddate:str
    parameter:str

