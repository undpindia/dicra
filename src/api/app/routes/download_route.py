import uuid
from sqlalchemy.orm import Session
from fastapi import APIRouter, Request, Response, status, Depends
from app.db.db import get_db
from app.models.index import Downloadables,Download
from app.schemas.index import Downloadable
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from azure.storage.blob import BlobClient
from fastapi.responses import FileResponse
from sqlalchemy import func
from app.config.config import settings

downloadRoute = APIRouter()


@downloadRoute.post('/addDownloadables', status_code=201)
async def getdownloadables(payload:Downloadable,db: Session = Depends(get_db)):
    try:
        downloadableFilesinstance=Downloadables(
           layer_id=payload.layerId,
           filename_on_blob=payload.fileName
        )
        db.add(downloadableFilesinstance)
        db.commit()
        return { 
            "success": True,
            "created_id": downloadableFilesinstance.id
        }
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e.orig))


@downloadRoute.get('/getfilenames', status_code=200)
async def getdownloadables(layerId: int,db: Session = Depends(get_db)):
    filenames=db.query(Downloadables.filename_on_blob).filter(Downloadables.layer_id==layerId).order_by(Downloadables.id).all()
    db.close()
    return {'code':200,
    'available_files':filenames}

@downloadRoute.get('/downloadfile',status_code=200)
async def downloads(
    layerId: int,
    filename: str,
    name: str,
    email: str,
    usage_type: str,
    purpose: str,
    db: Session = Depends(get_db)):
    random_id=uuid.uuid1()
    file_path = 'parameters/'+str(layerId)+'/DOWNLOADS/'+filename+'.zip'
    local_file_name = str(settings.TEMP_FILE_PATH)+filename + \
            "_"+str(random_id.hex)+"file.zip"
    try:
        blob = BlobClient(account_url=settings.AZURE_ACCOUNT_URL,
                    container_name=settings.CONTAINER_NAME,
                    blob_name=str(file_path)
                    )
        with open(str(local_file_name), "wb") as f:
            data = blob.download_blob()
            data.readinto(f)
            f.close()
        blob.close()
        to_create = Download(
            layer_id=layerId,
            file_name=filename,
            name=name,
            email=email,
            usage_type=usage_type,
            purpose=purpose
        )
        db.add(to_create)
        db.commit()
        return FileResponse(local_file_name,filename=filename+'.zip')
    except:
        return{
            'code':404,
            'message':"No file found"
        }