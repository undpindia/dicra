from pydantic import BaseModel
from pydantic.types import Json,Dict

class Customstat(BaseModel):
    geojson:Dict
    date:str
    layer_id:int