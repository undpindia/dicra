from pydantic import BaseModel
from pydantic.types import Json,Dict
from datetime import date

class Createparameter(BaseModel):
    available_date:date
    layer_id:int