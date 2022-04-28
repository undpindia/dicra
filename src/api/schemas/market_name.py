from pydantic import BaseModel
from pydantic.types import Json,Dict, List

class GetMarketDateRange(BaseModel):
    startdate:str
    enddate:str
    name:str
class GetMarketTrend(BaseModel):
    startdate:str
    enddate:str
    name:str
    parameter:str

class GetMarketCommTrend(BaseModel):
    startdate:str
    enddate:str
    name:str
    commodity:str
    parameter:str
    varity:str