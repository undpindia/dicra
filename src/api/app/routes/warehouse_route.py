from fastapi import APIRouter, Depends, FastAPI
from sqlalchemy.orm import Session
from app.db.db import get_db
# from models.index import Warehouse
from app.config.config import settings
import json


warehouseRouter = APIRouter()

@warehouseRouter.get('/warehouses', status_code=200)
def get_warehouses(db:Session=Depends(get_db)):
    
    with open(settings.WARE_HOUSE_PATH, 'r') as f:
        js = json.load(f)
    f.close()
    
    return{
        'code':200,
        'data':js
    }
