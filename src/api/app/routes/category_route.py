from sqlalchemy.orm import Session
from fastapi import APIRouter, Request, Response, status, Depends
from app.db.db import get_db
from app.models.index import (
    Category
)
from app.schemas.index import CreateCategory
from fastapi import HTTPException
from app.auth.auth import auth

categoryRouter = APIRouter()


@categoryRouter.get('/getallcategory', status_code=200)
async def getcategory(request: Request, db: Session = Depends(get_db)):
    return db.query(Category).filter().all()

@categoryRouter.post('/createcategory', status_code=200)
async def create_category(payload:CreateCategory,request: Request,db: Session = Depends(get_db)):
    category_instance=Category(
        category_name=payload.name
    )
    db.add(category_instance)
    db.commit()
    return { 
        "success": True,
        "created_id": category_instance.id
    }
@categoryRouter.delete('/deletecategory/{id}', status_code=200)
async def delete_category(id:int,request: Request,db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == id).first()
    if category:
        db.delete(category)
        db.commit()
        return {"detail": f"Category with ID {id} deleted."}
    else:
        raise HTTPException(status_code=404, detail="Category not found.")