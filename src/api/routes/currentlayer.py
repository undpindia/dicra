import os
import json
import boto3
import rasterio
import botocore
import configparser
from sqlalchemy import desc
from logging import exception
from datetime import datetime
from db.database import get_db
from boto3.session import Session
from models.index import Parameter
from rasterio.session import AWSSession
from azure.storage.blob import BlobClient
from fastapi.responses import FileResponse
from fastapi.responses import ORJSONResponse
from fastapi import APIRouter,File, UploadFile, Depends

config = configparser.ConfigParser()
config.read('config/config.ini')
AWS_ACCESS_KEY = config['AWS']['ACCESSKEY']
AWS_SECRET_KEY = config['AWS']['SECRETKEY']
AZURE_ACCOUNT_URL=config['azureblob']['Accounturl']
CONTAINER_NAME=config['azureblob']['Containername']
S3_BUCKET = config['s3bucket']['BucketName']
TEMP_FILE_PATH=config['paths']['Temporaryfiles']

current=APIRouter()
@current.get('/currentraster', status_code=200)
async def current_raster(parameter:str,db: Session = Depends(get_db)):
    availabledates=db.query(Parameter.available_date).filter(Parameter.parameter_name==parameter).order_by(desc(Parameter.available_date)).first()
    try:
        filedate = datetime.strptime(str(availabledates[0]), '%Y-%m-%d').strftime('%d-%m-%Y')
    except TypeError:
        return {
            'code':404,
            'message':"Please provide a valid parameter"
        }
    file_path = 'parameters/'+str(parameter)+'/RASTER/'+filedate+'.tif'
    local_file_name = str(TEMP_FILE_PATH)+parameter + \
            "_"+filedate+"_RASTERCURRENT.tif"
    try:
        blob = BlobClient(account_url=AZURE_ACCOUNT_URL,
                    container_name=CONTAINER_NAME,
                    blob_name=str(file_path)
                    )
        with open(str(local_file_name), "wb") as f:
            data = blob.download_blob()
            data.readinto(f)
            f.close()
        blob.close()
        return FileResponse(local_file_name)
    except:
        return{
            'code':404,
            'message':"No file found"
        }

@current.get('/currentvector', status_code=200)
async def current_vector(parameter:str,admbound:str,db: Session = Depends(get_db)):
    availabledates=db.query(Parameter.available_date).filter(Parameter.parameter_name==parameter).order_by(desc(Parameter.available_date)).first()
    try:
        filedate = datetime.strptime(str(availabledates[0]), '%Y-%m-%d').strftime('%d-%m-%Y')
    except TypeError:
        return {
            'code':404,
            'message':"Please provide a valid parameter"
        }
    FILE_TO_READ = 'parameters/'+str(parameter)+'/VECTOR/'+str(admbound).upper()+'/'+str(filedate)+'.geojson'
    try:
        blob = BlobClient(account_url=AZURE_ACCOUNT_URL,
                    container_name=CONTAINER_NAME,
                    blob_name=str(FILE_TO_READ)
                    )
        streamdownloader=blob.download_blob()
        fileReader = json.loads(streamdownloader.readall())
        return{
            'code':200,
            'data':fileReader
        }
    except:
        return{
            'code':404,
            'message':"No file found"
        }
