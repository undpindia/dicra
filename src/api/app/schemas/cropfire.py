from pydantic import BaseModel
from pydantic.types import Json,Dict

class GetPoint(BaseModel):
    geojson:Dict
    startdate:str
    enddate:str