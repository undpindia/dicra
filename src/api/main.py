import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, status
from routes.index import usecase,layer,trend,parameter,download,current,custom,points,weather,customdistrict,market,warehouse\
    ,lulc
from fastapi_pagination import add_pagination
from fastapi.staticfiles import StaticFiles

tags_metadata = [
    {
        "name":"Usecase",
        "description":"Operations related to usecase"
    },
    {
        "name":"Layerconfig",
        "description":"Operations related to layer configuration"
    },
    {
        "name":"Layer",
        "description":"Operations related to layers"
    },
    {
        "name":"Download",
        "description":"Endpoints for download data functionality"
    },
    {
        "name":"Custom",
        "description":"Endpoints to get data for custom drawn shape"
    },
    {
        "name":"Fire events",
        "description":"Endpoints to get fire events data"

    },
    {
        "name":"Weather Data",
        "description":"Endpoints to get weather data"
    },
    {
        "name":"Market Yard Data",
        "description":"Endpoints to get market yard data"
    },
    {
        "name":"Warehouse Details",
        "description":"Endpoints to get Warehouse Data"
    },
    {
        "name":"LULC",
        "description":"Endpoints to get LULC Data"
    }
   
]



app = FastAPI(debug=True,title="DiCRA - Data in Climate Resilient Agriculture")
app.mount("/static", StaticFiles(directory="static"), name="static")
origins = ["*"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usecase,tags=["Usecase"],include_in_schema=False)
app.include_router(layer,tags=['Layerconfig'],include_in_schema=False)
app.include_router(current,tags=['Layer'],include_in_schema=False)
app.include_router(download,tags=['Download'])
app.include_router(custom,tags=['Custom'],include_in_schema=False)
app.include_router(points,tags=['Fire events'],include_in_schema=False)
app.include_router(weather,tags=['Weather Data'],include_in_schema=False)
app.include_router(trend,include_in_schema=False)
app.include_router(parameter,include_in_schema=False)
app.include_router(customdistrict,tags=['Custom'],include_in_schema=False)
app.include_router(market,tags=['Market Yard Data'],include_in_schema=False)
app.include_router(warehouse,tags=['Warehouse Details'],include_in_schema=False)
app.include_router(lulc,tags=['LULC'],include_in_schema=False)




if __name__ == "__main__":
    uvicorn.run("main:app",host="0.0.0.0", port=5004,reload=True)





