from pydantic import BaseModel
from pydantic.types import Json,Dict

class Customdistrict(BaseModel):
    geojson:Dict