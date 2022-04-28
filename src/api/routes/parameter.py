import configparser
from fastapi import APIRouter
from fastapi import FastAPI, Depends,File, UploadFile,Form,status,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import true
from db.database import get_db
from models.index import Parameter


parameter=APIRouter()


@parameter.get("/availabledates/{parameter}")
async def get_avilable_dates(parameter,db:Session=Depends(get_db)):
    availabledates=db.query(Parameter.available_date).filter(Parameter.parameter_name==parameter).order_by(Parameter.available_date).all()
    db.close()
    return {
        "code":200,
        "available_dates":availabledates
    }



