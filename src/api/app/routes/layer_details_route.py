from sqlalchemy.orm import Session
from fastapi import APIRouter, Request, Response, status, Depends
from app.db.db import get_db
from app.models.index import Parameter
from app.schemas.index import Createparameter
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from sqlalchemy import func
from app.auth.auth import auth

layerdetailsRouter = APIRouter()


@layerdetailsRouter.get('/getlatestdate', status_code=200)
async def get_latest_date(layerid: int, request: Request, db: Session = Depends(get_db)):
    latest_available_date = (
        db.query(func.max(Parameter.available_date))
        .filter(Parameter.layer_id == layerid)
        .scalar()
    )
    db.close()
    return latest_available_date


@layerdetailsRouter.post('/addparameter', status_code=201)
async def insert_parameter(payload: Createparameter, db: Session = Depends(get_db)):
    try:
        exists = db.query(Parameter).filter_by(id=payload.layer_id, available_date=str(
            payload.available_date)).scalar() is not None
        if exists:
            return ({
                'messgae': 'Aborting insertion vailable date already exist for the given layer id.'
            })
        else:
            parameter_instance = Parameter(
                available_date=payload.available_date,
                layer_id=payload.layer_id

            )
            db.add(parameter_instance)
            db.commit()
            return ({
                "success": True,
                "created_id": parameter_instance.id
            })
    except IntegrityError as e:
        db.rollback()
        return({
            'error':f"An IntegrityError occurred: {e}"
        })

@layerdetailsRouter.delete('/deleteparameter', status_code=201)
async def insert_parameter(payload: Createparameter, db: Session = Depends(get_db)):
    try:
        parameter = db.query(Parameter).filter(Parameter.layer_id ==payload.layer_id,Parameter.available_date==payload.available_date).first()
        if parameter:
            db.delete(parameter)
            db.commit()
            return {"detail": f"Parameter with the date {str({payload.available_date})} for the layer {str(payload.layer_id)} deleted ."}
        else:
            raise HTTPException(status_code=404, detail="Available date not found.")
    except IntegrityError as e:
        db.rollback()
        return({
            'error':f"An IntegrityError occurred: {e}"
        })