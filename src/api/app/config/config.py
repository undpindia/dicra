
from pydantic import BaseSettings, EmailStr


class Settings(BaseSettings):
    POSTGRES_CONNECTION_STRING:str
    BASE_BLOB_PATH:str
    PARAMETERS_PATH:str
    DISTRICT_BOUNDARY_PATH:str
    CDN_ENDPOINT:str
    TEMP_FILE_PATH:str
    AZURE_ACCOUNT_URL:str
    CONTAINER_NAME:str
    LULC_PATH:str
    AUTH_TOKEN:str
    WARE_HOUSE_PATH:str
    CROP_FIRE_PATH:str
    class Config:
        env_file = './.env'

settings = Settings()