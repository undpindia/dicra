from pydantic import BaseModel
from pydantic.types import Json,Dict

class GetPixel(BaseModel):
    latitude:str
    longitude:str
    layer_id:int
    