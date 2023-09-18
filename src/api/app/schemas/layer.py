from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from pydantic.types import Json,Dict

class LayerBase(BaseModel):
    unit: str
    xaxislabel: str
    isavailable: bool
    layer_name: str
    citation: Optional[str] = None
    last_updated: Optional[datetime] = None
    standards: Optional[str] = None
    short_description: Optional[str] = None
    raster_status: bool
    timerangefilter: bool
    long_description: Optional[str] = None
    vector_status: bool
    showcustom: bool
    source: Optional[str] = None
    multiple_files: bool
    datafromvector: bool
    url: Optional[str] = None
    display_name: str
    yaxislabel: str

class LayerCreate(LayerBase):
    region_id: int
    category_id: int
    
class LayerPercentage(BaseModel):
    geojson:Dict
    layer_id:int
    layer_name:str
