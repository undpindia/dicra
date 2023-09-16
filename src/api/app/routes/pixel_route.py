import datetime
import math

from fastapi import APIRouter, Request

from azure.storage.blob import BlobServiceClient
from sqlalchemy.orm import Session
from rasterstats import point_query
import shapely

from app.schemas.index import GetPixel
from app.config.config import settings

pixelRouter = APIRouter()

@pixelRouter.post('/getpixel', status_code=200)
async def get_pixel(details: GetPixel, request: Request):

    # Define your Azure Blob Storage connection string and container name
    connection_string = "DefaultEndpointsProtocol=https;AccountName=dicratilerdev;AccountKey=kmA7npOjR6TV1vcswXk2I/mvGWs2pSmsfOL+yvsgciDiiPA0ZkUoFhHBWPLVTy06WCMb7s2Bc9BM+AStyln1qA==;EndpointSuffix=core.windows.net"
    container_name = settings.CONTAINER_NAME
    file_path = 'parameters/' + str(details.layer_id) + '/RASTER/'

    # Create a BlobServiceClient using the connection string
    blob_service_client = BlobServiceClient.from_connection_string(
        connection_string)

    # Get a reference to the container
    container_client = blob_service_client.get_container_client(container_name)

    # List all blobs in the container
    blobs = container_client.list_blobs(name_starts_with=file_path)

    # Find the latest blob based on the last blob name
    latest_blob = None
    latest_timestamp = None

    for blob in blobs:
        new_blob_name = str(blob.name).split('/')
        new_blob = new_blob_name[-1].split('.')
        new_blob_date_str = new_blob[0]
        new_blob_date = datetime.datetime.strptime(
            new_blob_date_str, '%d-%m-%Y')
        if latest_timestamp is None or new_blob_date > latest_timestamp:
            latest_blob = blob
            latest_timestamp = new_blob_date

    if latest_blob:
        print("Latest blob name:", latest_blob.name)

        # Define the path to your raster image
        raster_path = str(settings.AZURE_ACCOUNT_URL + '/' +
                        container_name + '/' + latest_blob.name)

        point = shapely.Point(details.longitude, details.latitude)

        pointvalue = point_query(point, raster_path)

        if (pointvalue[0] is None or math.isnan(pointvalue[0])):
            pixel = None
        else:
            pixel = round(pointvalue[0], 2)

        print("Pixel value:", pixel)

        return ({
            "code": 200,
            "pixelvalue": pixel
        })
    else:
        print("No blobs found in the container.")
        return ({
            "code": 400,
            "message": "No blob found"
        })
