from datetime import date, datetime
from pydantic import BaseModel

class Getweather(BaseModel):
    district: str
    mandal: str
    parameter:str
    start_date: str
    end_date: str

class Returnweather(BaseModel):
    district:str
    mandal:str    
