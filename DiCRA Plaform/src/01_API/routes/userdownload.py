import os
import json
import boto3
import botocore
import configparser
from datetime import datetime
from db.database import get_db
from boto3.session import Session
from models.index import Downloads
from fastapi import APIRouter, Depends
from azure.storage.blob import BlobClient
from fastapi.responses import FileResponse

config = configparser.ConfigParser()
config.read('config/config.ini')
AWS_ACCESS_KEY = config['AWS']['ACCESSKEY']
AWS_SECRET_KEY = config['AWS']['SECRETKEY']
S3_BUCKET = config['s3bucket']['BucketName']
TEMP_FILE_PATH = config['paths']['Temporaryfiles']
AZURE_ACCOUNT_URL=config['azureblob']['Accounturl']
CONTAINER_NAME=config['azureblob']['Containername']
AZURE_BLOB_PATH= config['azureblob']['Blobpath']

download = APIRouter()

@download.get('/downloadraster', status_code=200)
async def download_rasterdata(
    parameter: str,
    date: str,
    name: str,
    email: str,
    usage_type: str,
    purpose: str,
    db: Session = Depends(get_db)
    ):
    filedate = datetime.strptime(date, '%Y-%m-%d').strftime('%d-%m-%Y')
    file_path = 'parameters/'+str(parameter)+'/RASTER/'+filedate+'.tif'
    print(file_path)
    try:
        blob = BlobClient(account_url=AZURE_ACCOUNT_URL,
                    container_name=CONTAINER_NAME,
                    blob_name=str(file_path)
                    )
        local_file_name = str(TEMP_FILE_PATH)+parameter + \
                "_"+filedate+"_RASTER.tif"
        with open(str(local_file_name), "wb") as f:
            data = blob.download_blob()
            data.readinto(f)
            f.close()
        blob.close()
        to_create = Downloads(
            layername=parameter,
            type='RASTER',
            parameterdate=str(date),
            region="",
            name=name,
            email=email,
            usage_type=usage_type,
            purpose=purpose
        )
        db.add(to_create)
        db.commit()
        return FileResponse(local_file_name)
    except:
        return{
            'code':404,
            'message':"No file found"
        }
    
@download.get('/downloadvector', status_code=200)
async def download_vectordata(
    parameter: str,
    date: str,
    name: str,
    email: str,
    usage_type: str,
    purpose: str,
    region:str,
    db: Session = Depends(get_db)
    ):
    filedate = datetime.strptime(date, '%Y-%m-%d').strftime('%d-%m-%Y')
    if(region=='MANDAL'):
        file_path = 'parameters/'+str(parameter)+'/VECTOR/'+region+"/"+filedate+'.geojson'
    elif(region=='DISTRICT'):
        file_path = 'parameters/'+str(parameter)+'/VECTOR/'+region+"/"+filedate+'.geojson'
    local_file_name = str(TEMP_FILE_PATH)+parameter + \
            "_"+filedate+"VECTOR.geojson"
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
        to_create = Downloads(
            layername=parameter,
            type='VECTOR',
            parameterdate=str(date),
            region=str(region),
            name=name,
            email=email,
            usage_type=usage_type,
            purpose=purpose
        )
        db.add(to_create)
        db.commit()
        return FileResponse(local_file_name)
    except:
        return{
            'code':404,
            'message':"No file found"
        }
