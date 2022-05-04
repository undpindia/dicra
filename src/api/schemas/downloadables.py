from datetime import date, datetime
from pydantic import BaseModel

class Getparam(BaseModel):
    parameter:str