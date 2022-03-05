import uuid
import configparser
from fastapi import APIRouter
from db.database import get_db
from sqlalchemy.orm import Session
from models.index import Job,Usecase
from sqlalchemy.sql.expression import true
from schemas.index import CreateUsecase,OutputUsecase
from fastapi_pagination import LimitOffsetPage, Page, add_pagination,paginate
from fastapi import FastAPI, Depends,File, UploadFile,Form,status,HTTPException


usecase=APIRouter()

@usecase.post("/addusecase")
def create(
 project_name:str = Form(...),
 project_type:str = Form(...),
 short_description:str = Form(...),
 long_description:str = Form(...),
 url:str = Form(...),
 image:UploadFile = File(...),
 username:str = Form(...),
 email_id:str = Form(...),
 db: Session = Depends(get_db)):
    random_id=uuid.uuid1()
    file_name_to_store=project_name+'-'+str(random_id.hex)+'-'+image.filename
    file_name_to_store=file_name_to_store.replace(" ", "")
    to_create = Usecase(
        project_name=project_name,
        project_type=project_type,
        short_description=short_description,
        long_description=long_description,
        url=url,
        image=file_name_to_store,
        username=username,
        email_id=email_id,
        approved=True
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
@usecase.get("/usecases",response_model=Page[OutputUsecase])
@usecase.get("/usecases/limit-offset",response_model=LimitOffsetPage[OutputUsecase])
async def get_usecase(db: Session = Depends(get_db)):
    return paginate(db.query(Usecase).filter(Usecase.approved==True).all())
add_pagination(usecase)

# Read usecases by id
@usecase.get("/usecases/{id}")
async def get_usecase_id(id,db:Session=Depends(get_db)):
    usecases=db.query(Usecase).filter(Usecase.id==id).first()
    if not usecases:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f'usecase with {id} is not available')
    return{
        "code":200,
        "usecase":usecases
    }




 


