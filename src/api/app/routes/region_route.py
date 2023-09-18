from sqlalchemy.orm import Session
from fastapi import APIRouter, Request, Response, status, Depends
from app.db.db import get_db
from app.models.index import Region
from app.schemas.index import CreateRegion
from app.auth.auth import auth

regionRouter = APIRouter()

@regionRouter.get('/getallregion', status_code=200)
async def get_region(request: Request,db: Session = Depends(get_db)):
    return db.query(Region).filter().all()
@regionRouter.post('/createregion', status_code=201)
async def create_region(payload:CreateRegion,request: Request,db: Session = Depends(get_db)):
    region_instance=Region(
        name=payload.name
    )
    db.add(region_instance)
    db.commit()
    return { 
        "success": True,
        "created_id": region_instance.id
    }




