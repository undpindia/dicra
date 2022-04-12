from pydantic import BaseModel

class CreateUsecase(BaseModel):
    project_name: str
    project_type: str
    short_description:str
    long_description:str
    url:str
    image:str
    username:str
    email_id:str
    approved:bool

    class Config:
        orm_mode = True

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

    class Config:
        orm_mode = True
