from pydantic import BaseModel
from datetime import date
class OutputUsecase(BaseModel):
    id:int
    project_name: str
    project_type: str
    short_description:str
    long_description:str
    url:str
    image:str
    username:str
    email_id:str
    approved:bool
    region_id:int
    created_date:date

    class Config:
        orm_mode = True