import uuid
from sqlalchemy.orm import Session
from fastapi import APIRouter, Request, Response, status, Depends,Form,UploadFile,File,HTTPException
from app.db.db import get_db
import datetime
from app.models.index import Region
from app.schemas.index import CreateRegion
from app.models.usecase import Usecase
from app.schemas.index import OutputUsecase

from fastapi_pagination import LimitOffsetPage, Page, add_pagination,paginate

usecaseRouter = APIRouter()


@usecaseRouter.post('/createusecase', status_code=201)
async def create_usecase(
        project_name: str = Form(...),
        project_type: str = Form(...),
        short_description: str = Form(...),
        long_description: str = Form(...),
        url: str = Form(...),
        image: UploadFile = File(...),
        username: str = Form(...),
        email_id: str = Form(...),
        region_id: int = Form(...),
        db: Session = Depends(get_db)):
    ext = image.filename.split(".")[-1]
    random_name = str(uuid.uuid4())
    file_name_to_store=f"{random_name}.{ext}"
    to_create = Usecase(
        project_name=project_name,
        project_type=project_type,
        short_description=short_description,
        long_description=long_description,
        url=url,
        image=file_name_to_store,
        username=username,
        email_id=email_id,
        approved=False,
        region_id=region_id
    )
    db.add(to_create)
    db.commit()
    file_location = f"./static/{file_name_to_store}"
    with open(file_location, "wb+") as file_object:
        file_object.write(image.file.read())
    file_object.close()
    return { 
        "success": True,
        "created_id": to_create.id
    }
# Read all usecases with pagination
@usecaseRouter.get("/usecases/{region}",response_model=Page[OutputUsecase])
@usecaseRouter.get("/usecases/limit-offset",response_model=LimitOffsetPage[OutputUsecase])
async def get_usecase(region:int,db: Session = Depends(get_db)):
    return paginate(db.query(Usecase).filter(Usecase.approved==True,Usecase.region_id==region).all())
add_pagination(usecaseRouter)
# Read usecases by id
@usecaseRouter.get("/getusecase/{id}")
async def get_usecase_id(id:int,db:Session=Depends(get_db)):
    usecases=db.query(Usecase).filter(Usecase.id==id).first()
    db.close()
    if not usecases:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f'usecase with {id} is not available')
    return{
        "code":200,
        "usecase":usecases
    }

