from sqlalchemy.orm import Session
from fastapi import APIRouter, Request, Response, status, Depends
from app.db.db import get_db
from app.models.index import Layer
from app.schemas.index import LayerCreate, LayerBase, LayerPercentage
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from app.auth.auth import auth
from app.config.config import settings
from rasterstats import zonal_stats
import datetime
from app.utils.util import toUnix

LULCRASTER = settings.LULC_PATH

layerRouter = APIRouter()


@layerRouter.get('/getlayerconfig', status_code=200)
async def get_layer_config(regionid:int,request: Request,db: Session = Depends(get_db)):
    data=db.query(Layer).filter_by(region_id=regionid).all()
    db.close()
    no2_lst = []
    pm25_lst = []
    layer_lst = []
    ndvi_layer_lst = []
    final_layer_lst = []
    for i in data:
        if i.layer_name == 'NO2_DPPD':
            no2_dict = {
                "isavailable": i.isavailable,
                "long_description": i.long_description,
                "display_name": i.display_name,
                "layer_name": i.layer_name,
                "vector_status": i.vector_status,
                "yaxislabel": i.yaxislabel,
                "citation": i.citation,
                "showcustom": i.showcustom,
                "region_id": i.region_id,
                "last_updated": i.last_updated,
                "source": i.source,
                "category_id": i.category_id,
                "standards": i.standards,
                "multiple_files": i.multiple_files,
                "unit": i.unit,
                "short_description": i.short_description,
                "datafromvector": i.datafromvector,
                "id": i.id,
                "raster_status": i.raster_status,
                "url": i.url,
                "xaxislabel": i.xaxislabel,
                "timerangefilter": i.timerangefilter
            }
            no2_lst.append(no2_dict)
        elif i.layer_name == 'PM25_DPPD':
            pm25_dict = {
                "isavailable": i.isavailable,
                "long_description": i.long_description,
                "display_name": i.display_name,
                "layer_name": i.layer_name,
                "vector_status": i.vector_status,
                "yaxislabel": i.yaxislabel,
                "citation": i.citation,
                "showcustom": i.showcustom,
                "region_id": i.region_id,
                "last_updated": i.last_updated,
                "source": i.source,
                "category_id": i.category_id,
                "standards": i.standards,
                "multiple_files": i.multiple_files,
                "unit": i.unit,
                "short_description": i.short_description,
                "datafromvector": i.datafromvector,
                "id": i.id,
                "raster_status": i.raster_status,
                "url": i.url,
                "xaxislabel": i.xaxislabel,
                "timerangefilter": i.timerangefilter
            }
            pm25_lst.append(pm25_dict)
        else:
            if int(i.region_id) == 2 and i.layer_name == 'NDVI':
                ndvi_layer_dict = {
                    "isavailable": i.isavailable,
                    "long_description": i.long_description,
                    "display_name": i.display_name,
                    "layer_name": i.layer_name,
                    "vector_status": i.vector_status,
                    "yaxislabel": i.yaxislabel,
                    "citation": i.citation,
                    "showcustom": i.showcustom,
                    "region_id": i.region_id,
                    "last_updated": i.last_updated,
                    "source": i.source,
                    "category_id": i.category_id,
                    "standards": i.standards,
                    "multiple_files": i.multiple_files,
                    "unit": i.unit,
                    "short_description": i.short_description,
                    "datafromvector": i.datafromvector,
                    "id": i.id,
                    "raster_status": i.raster_status,
                    "url": i.url,
                    "xaxislabel": i.xaxislabel,
                    "timerangefilter": i.timerangefilter
                }
                ndvi_layer_lst.append(ndvi_layer_dict)
            else:
                layer_dict = {
                    "isavailable": i.isavailable,
                    "long_description": i.long_description,
                    "display_name": i.display_name,
                    "layer_name": i.layer_name,
                    "vector_status": i.vector_status,
                    "yaxislabel": i.yaxislabel,
                    "citation": i.citation,
                    "showcustom": i.showcustom,
                    "region_id": i.region_id,
                    "last_updated": i.last_updated,
                    "source": i.source,
                    "category_id": i.category_id,
                    "standards": i.standards,
                    "multiple_files": i.multiple_files,
                    "unit": i.unit,
                    "short_description": i.short_description,
                    "datafromvector": i.datafromvector,
                    "id": i.id,
                    "raster_status": i.raster_status,
                    "url": i.url,
                    "xaxislabel": i.xaxislabel,
                    "timerangefilter": i.timerangefilter
                }
                layer_lst.append(layer_dict)
    final_layer_lst.extend(ndvi_layer_lst)
    final_layer_lst.extend(layer_lst)
    final_layer_lst.extend(no2_lst)
    final_layer_lst.extend(pm25_lst)

    return final_layer_lst

@layerRouter.post('/createlayer',status_code=201)
async def create_layer(payload:LayerCreate,db: Session = Depends(get_db)):
    try:
        layer_instance=Layer(
            unit=payload.unit,
            xaxislabel=payload.xaxislabel,
            isavailable=payload.isavailable,
            layer_name=payload.layer_name,
            citation=payload.citation,
            last_updated=payload.last_updated,
            standards=payload.standards,
            short_description=payload.short_description,
            raster_status=payload.raster_status,
            timerangefilter=payload.timerangefilter,
            long_description=payload.long_description,
            vector_status=payload.vector_status,
            showcustom=payload.showcustom,
            source=payload.source,
            multiple_files=payload.multiple_files,
            datafromvector=payload.datafromvector,
            url=payload.url,
            display_name=payload.display_name,
            yaxislabel=payload.yaxislabel,
            region_id=payload.region_id,
            category_id=payload.category_id
        )
        db.add(layer_instance)
        db.commit()
        return { 
            "success": True,
            "created_id": layer_instance.id
        }
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e.orig))

@layerRouter.delete('/deletelayer/{layerid}')
async def delete_layer(layer_id: int, db: Session = Depends(get_db)):
    layer = db.query(Layer).filter(Layer.id == layer_id).first()
    if layer:
        db.delete(layer)
        db.commit()
        return {"detail": f"Layer with ID {layer_id} deleted."}
    else:
        raise HTTPException(status_code=404, detail="Layer not found.")
    
@layerRouter.post('/updatelayer/{layerid}',status_code=202)
async def update_layer(layer_id: int, payload:LayerBase,db: Session = Depends(get_db)):
    try:
        layer = db.query(Layer).filter(Layer.id == layer_id).first()
        layer.unit = payload.unit
        layer.xaxislabel=payload.xaxislabel
        layer.layer_name=payload.layer_name
        layer.isavailable=payload.isavailable
        layer.citation=payload.citation
        layer.last_updated=payload.last_updated
        layer.standards=payload.standards
        layer.short_description=payload.short_description
        layer.raster_status=payload.raster_status
        layer.timerangefilter=payload.timerangefilter
        layer.long_description=payload.long_description
        layer.vector_status=payload.vector_status
        layer.showcustom=payload.showcustom
        layer.source=payload.source
        layer.multiple_files=payload.multiple_files
        layer.datafromvector=payload.datafromvector
        layer.url=payload.url
        layer.display_name=payload.display_name
        layer.yaxislabel=payload.yaxislabel
        db.commit()
        return { 
            "success": True,
            "message": "updated"
        }
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e.orig))
    
class layer_dict(dict):
    # __init__ function
    def __init__(self):
        self = dict() 
    # Function to add key:value
    def add(self, key, value):
        self[key] = value

@layerRouter .post('/getlayerpercentage', status_code=200)
async def get_percentage(details:LayerPercentage,db:Session=Depends(get_db)):
    crop_intensity=[
        '01-01-2022'
    ]
    crop_land=[
        '01-01-2022'
    ]
    crop_type=[
        '01-01-2015'
    ]
    crop_stress=[
        '02-07-2022',
        '01-08-2022',
        '02-08-2022',
        '01-09-2022',
        '02-09-2022',
        '01-10-2022',
        '02-10-2022',
    ]
    
    layerdict_obj = layer_dict()
    if details.layer_name == 'crop_intensity':
        classes={
            "1": "Single Crop",
            "2": "Double Crop",
            "3": "Triple Crop",
            "4": "Other LULC"
        }
        classesid=[1,2,3,4]
        for i in crop_intensity:
            f_path=LULCRASTER+str(details.layer_id)+"/RASTER/"+i+".tif"
            stats = zonal_stats(details.geojson,
            f_path,
            categorical=True)[0]
            totalpixels=sum(stats.values())
            for k, v in stats.items():
                pct = v * 100.0 / totalpixels
                stats.update({k:pct})
            layerdict_obj.add(i,stats)
            
    elif details.layer_name == 'crop_land':
        classes={
            "1": "Cropland",
            "2": "NonCropland"
        }
        classesid=[1,2]
        for i in crop_land:
            f_path=LULCRASTER+str(details.layer_id)+"/RASTER/"+i+".tif"
            stats = zonal_stats(details.geojson,
            f_path,
            categorical=True)[0]
            totalpixels=sum(stats.values())
            for k, v in stats.items():
                pct = v * 100.0 / totalpixels
                stats.update({k:pct})
            layerdict_obj.add(i,stats)
            
    elif details.layer_name == 'crop_type':
        classes={
            "1": "Irrigated-DC-rice-pulses",
            "2": "Irrigated-TC-pulses/rice-rice",
            "3": "Irrigated-DC-maize/potato-wheat ",
            "4": "Irrigated-sugarcane",
            "5": "Irrigated-DC-Pulses/maize-wheat ",
            "6": "Rainfed-supplemental-DC-cotto",
            "7": "Rainfed-SC_pigeonpea/groundnut",
            "8": "Rainfed-SC-cotton/groundnut",
            "9": "Rainfed-SC-millet",
            "10": "Rainfed-DC-sorghum-chickpea/fallow",
            "11": "Rainfed-SC-pulses",
            "12": "Rainfed-SC-rice-fallow",
            "13": "Mixed crops",
            "14": "Other LULC"
        }
        classesid=[1,2,3,4,5,6,7,8,9,10,11,12,13,14]
        for i in crop_type:
            f_path=LULCRASTER+str(details.layer_id)+"/RASTER/"+i+".tif"
            stats = zonal_stats(details.geojson,
            f_path,
            categorical=True)[0]
            totalpixels=sum(stats.values())
            for k, v in stats.items():
                pct = v * 100.0 / totalpixels
                stats.update({k:pct})
            layerdict_obj.add(i,stats)
        
    elif details.layer_name == 'crop_stress':
        classes={
            "1": "No crop stress",
            "2": "Mild stress",
            "3": "Moderate stress",
            "4": "Severe stress",
            "5": "Cropland/cloud",
            "6": "Water bodies",
            "7": "Other LULC"
        }
        classesid=[1,2,3,4,5,6,7]
        for i in crop_stress:
            f_path=LULCRASTER+str(details.layer_id)+"/RASTER/"+i+".tif"
            stats = zonal_stats(details.geojson,
            f_path,
            categorical=True)[0]
            totalpixels=sum(stats.values())
            for k, v in stats.items():
                pct = v * 100.0 / totalpixels
                stats.update({k:pct})
            layerdict_obj.add(i,stats)
            
    layer_trendobj=layer_dict()
    for cl in classesid:
        layer_trend=[]
        for k,v in layerdict_obj.items():
            datem = datetime.datetime.strptime(k, "%d-%m-%Y").strftime('%d-%m-%Y')
            if cl in v:
                layer_trend.append([toUnix(datem),v[cl]])
            else:
                layer_trend.append([toUnix(datem),0])
        layer_trendobj.add(cl,layer_trend)
   
    return{
        "code":200,
        "classes":classes,
        "data":layerdict_obj,
        'trend':layer_trendobj
    }
