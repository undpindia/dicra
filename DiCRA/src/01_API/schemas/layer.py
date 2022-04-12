from datetime import date, datetime
from pydantic import BaseModel

class CreateLayer(BaseModel):
    layer_name: str
    short_description: str
    long_description:str
    source:str
    url:str
    unit:str
    color:str
    update_frequnecy:int
    last_updated:datetime
    raster_status:bool
    vector_status:bool
    multiple_files:bool
    display_name:str
    category:str
    class Config:
        orm_mode = True
