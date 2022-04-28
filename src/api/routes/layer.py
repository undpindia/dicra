import configparser
from fastapi import APIRouter
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import true
from schemas.index import CreateLayer
from db.database import get_db
from models.index import Layer
from itertools import groupby
from fastapi_pagination import LimitOffsetPage, Page, add_pagination,paginate
import itertools
from operator import itemgetter


from pydantic import BaseModel


layer= APIRouter()

@layer.post("/addlayer")
def create(details:CreateLayer, db: Session = Depends(get_db)):
    to_create=Layer(
        layer_name=details.layer_name,
        short_description=details.short_description,
        long_description=details.long_description,
        source=details.source,
        url=details.url,
        unit=details.unit,
        color=details.color,
        update_frequnecy=details.update_frequnecy,
        last_updated=details.last_updated,
        raster_status=details.raster_status,
        vector_status=details.vector_status,
        multiple_files=details.multiple_files,
        display_name=details.display_name,
        category=details.category,
        isavailable=details.isavailable,
        citation=details.citation,
        standards=details.standards,
        timerangefilter=details.timerangefilter,
        showcustom=details.showcustom,
        datafromvector=details.datafromvector
    )
    db.add(to_create)
    db.commit()
    return { 
        "success": True,
        "created_id": to_create.id
    }

@layer.get("/getlayerconfig")
async def get_layers(db:Session=Depends(get_db)):
    result=db.query(Layer).order_by(Layer.id).all()
    db.close()
    return result

@layer.get("/layers",response_model=Page[CreateLayer])
@layer.get("/layers/limit-offset",response_model=LimitOffsetPage[CreateLayer])
async def get_layers(db: Session = Depends(get_db)):
    return paginate(db.query(Layer).all())
add_pagination(layer)






