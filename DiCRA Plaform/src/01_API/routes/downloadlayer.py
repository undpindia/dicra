import os
import configparser
from boto3.session import Session
from fastapi.responses import FileResponse
from fastapi import APIRouter,File, UploadFile


config = configparser.ConfigParser()
config.read('config/config.ini')
AWS_ACCESS_KEY = config['AWS']['ACCESSKEY']
AWS_SECRET_KEY = config['AWS']['SECRETKEY']
S3_BUCKET = config['s3bucket']['BucketName']
TEMP_FILE_PATH=config['paths']['Temporaryfiles']

raster=APIRouter()

@raster.get('/currentlayer', status_code=200)
def all(parameter:str=None):
    session = Session(aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)

    s3 = session.resource('s3')

    bucket = s3.Bucket(S3_BUCKET)

    objects = bucket.objects.filter(Prefix='parameters/NDVI/RASTER')

    if parameter == 'NDVI':
        for object in objects:
            if object.key.endswith('.tif'):
                key = object.key
                file = key.split('/')
                filename = str(file[3])
                print(filename)
                local_filename = os.path.join(TEMP_FILE_PATH, filename)
                bucket.download_file(key, local_filename)
                return FileResponse(local_filename)