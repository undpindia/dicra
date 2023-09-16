from pydantic import BaseModel
from pydantic.types import Json,Dict

class CreateCategory(BaseModel):
    name:str