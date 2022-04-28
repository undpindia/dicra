import botocore
import json
import os
import configparser
import boto3
from boto3.session import Session
from fastapi.responses import FileResponse
from fastapi import APIRouter, Depends
from db.database import get_db
from models.index import Downloads,Downloadables
from azure.storage.blob import BlobClient
from datetime import datetime
from schemas.index import Getparam
from fastapi.responses import StreamingResponse
import uuid



config = configparser.ConfigParser()
config.read('config/config.ini')
AWS_ACCESS_KEY = config['AWS']['ACCESSKEY']
AWS_SECRET_KEY = config['AWS']['SECRETKEY']
S3_BUCKET = config['s3bucket']['BucketName']
TEMP_FILE_PATH = config['paths']['Temporaryfiles']
AZURE_ACCOUNT_URL=config['azureblob']['Accounturl']
CONTAINER_NAME=config['azureblob']['Containername']

download = APIRouter()


# @download.get('/downloadraster', status_code=200)
# async def download_rasterdata(
#     parameter: str,
#     date: str,
#     name: str,
#     email: str,
#     usage_type: str,
#     purpose: str,
#     db: Session = Depends(get_db)
#     ):
#     filedate = datetime.strptime(date, '%Y-%m-%d').strftime('%d-%m-%Y')
#     file_path = 'parameters/'+str(parameter)+'/RASTER/'+filedate+'.tif'
#     print(file_path)
#     try:
#         blob = BlobClient(account_url=AZURE_ACCOUNT_URL,
#                     container_name=CONTAINER_NAME,
#                     blob_name=str(file_path)
#                     )
#         local_file_name = str(TEMP_FILE_PATH)+parameter + \
#                 "_"+filedate+"_RASTER.tif"
#         with open(str(local_file_name), "wb") as f:
#             data = blob.download_blob()
#             data.readinto(f)
#             f.close()
#         blob.close()
#         to_create = Downloads(
#             layername=parameter,
#             type='RASTER',
#             parameterdate=str(date),
#             region="",
#             name=name,
#             email=email,
#             usage_type=usage_type,
#             purpose=purpose
#         )
#         db.add(to_create)
#         db.commit()
#         return FileResponse(local_file_name)
#     except:
#         return{
#             'code':404,
#             'message':"No file found"
#         }
    


# @download.get('/downloadvector', status_code=200)
# async def download_vectordata(
#     parameter: str,
#     date: str,
#     name: str,
#     email: str,
#     usage_type: str,
#     purpose: str,
#     region:str,
#     db: Session = Depends(get_db)
#     ):
#     filedate = datetime.strptime(date, '%Y-%m-%d').strftime('%d-%m-%Y')
#     if(region=='MANDAL'):
#         file_path = 'parameters/'+str(parameter)+'/VECTOR/'+region+"/"+filedate+'.geojson'
#     elif(region=='DISTRICT'):
#         file_path = 'parameters/'+str(parameter)+'/VECTOR/'+region+"/"+filedate+'.geojson'
#     local_file_name = str(TEMP_FILE_PATH)+parameter + \
#             "_"+filedate+"VECTOR.geojson"
#     try:
#         blob = BlobClient(account_url=AZURE_ACCOUNT_URL,
#                     container_name=CONTAINER_NAME,
#                     blob_name=str(file_path)
#                     )
#         with open(str(local_file_name), "wb") as f:
#             data = blob.download_blob()
#             data.readinto(f)
#             f.close()
#         blob.close()
#         to_create = Downloads(
#             layername=parameter,
#             type='VECTOR',
#             parameterdate=str(date),
#             region=str(region),
#             name=name,
#             email=email,
#             usage_type=usage_type,
#             purpose=purpose
#         )
#         db.add(to_create)
#         db.commit()
#         return FileResponse(local_file_name)
#     except:
#         return{
#             'code':404,
#             'message':"No file found"
#         }
@download.get('/getfilenames', status_code=200)
async def getdownloadables(parameter: str,db: Session = Depends(get_db)):
    filenames=db.query(Downloadables.filename_on_blob).filter(Downloadables.parameter==parameter).order_by(Downloadables.id).all()
    db.close()
    return {'code':200,
    'available_files':filenames}
@download.get('/downloadfile',status_code=200)
async def downloads(
    parameter: str,
    filename: str,
    name: str,
    email: str,
    usage_type: str,
    purpose: str,
    region:str,
    db: Session = Depends(get_db)):
    random_id=uuid.uuid1()
    file_path = 'parameters/'+str(parameter)+'/DOWNLOADS/'+filename+'.zip'
    local_file_name = str(TEMP_FILE_PATH)+parameter + \
            "_"+str(random_id.hex)+"file.zip"
    print(local_file_name)
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
            type='ZIP',
            parameterdate=str('2022-01-01'),
            region=str(region),
            name=name,
            email=email,
            usage_type=usage_type,
            purpose=purpose
        )
        db.add(to_create)
        db.commit()
        return FileResponse(local_file_name,filename=parameter+'.zip')
    except:
        return{
            'code':404,
            'message':"No file found"
        }

