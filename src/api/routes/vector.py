import json
import os
import configparser
import boto3
from boto3.session import Session
from fastapi.responses import ORJSONResponse
from fastapi import APIRouter,File, UploadFile



config = configparser.ConfigParser()
config.read('config/config.ini')
AWS_ACCESS_KEY = config['AWS']['ACCESSKEY']
AWS_SECRET_KEY = config['AWS']['SECRETKEY']
S3_BUCKET = config['s3bucket']['BucketName']
TEMP_FILE_PATH=config['paths']['Temporaryfiles']

vector=APIRouter()
@vector.get('/getvector',response_class=ORJSONResponse, status_code=200)
async def get_vector(Administrative_boundary:str=None):
    if Administrative_boundary == "District":
        BUCKET = 'undp-dataforpolicy'
        FILE_TO_READ = 'parameters/NDVI/VECTOR/DISTRICT/NDVI_2021_01_01.geojson'
        client = boto3.client('s3',
                       aws_access_key_id=AWS_ACCESS_KEY,
                       aws_secret_access_key=AWS_SECRET_KEY
                     )
        result = client.get_object(Bucket=BUCKET, Key=FILE_TO_READ)
        text = result["Body"].read().decode()
        jsonobj=json.loads(text)
        return {'code':200,
        'data':jsonobj}

    elif Administrative_boundary == "Mandal":
        BUCKET = 'undp-dataforpolicy'
        FILE_TO_READ = 'parameters/NDVI/VECTOR/MANDAL/NDVI_2021_02_02.geojson'
        client = boto3.client('s3',
                       aws_access_key_id=AWS_ACCESS_KEY,
                       aws_secret_access_key=AWS_SECRET_KEY
                     )
        result = client.get_object(Bucket=BUCKET, Key=FILE_TO_READ)
        text = result["Body"].read().decode()
        jsonobj=json.loads(text)
        return {'code':200,
        'data':jsonobj}