from pydantic import BaseModel
from pydantic.types import Json,Dict

class CreateRegion(BaseModel):
    name:str