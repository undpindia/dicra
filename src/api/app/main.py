from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes.index import(
    regionRouter,
    categoryRouter,
    layerRouter,
    vectorRouter,
    trendRouter,
    customshapeRouter,
    customdistrictRouter,
    layerdetailsRouter,
    rasterRouter,
    currentlayerRouter,
    usecaseRouter,
    downloadRoute,
    lulcRoute,
    warehouseRouter,
    cropfireRouter,
    pixelRouter
)

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
origins = ["*"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {"message": "Dicra V2 helth status is ok"}
app.include_router(regionRouter, tags=['Regions'], prefix='/api/v2')
app.include_router(categoryRouter, tags=['Categories'], prefix='/api/v2')
app.include_router(layerRouter, tags=['Layers'], prefix='/api/v2')
app.include_router(vectorRouter, tags=['Vector'], prefix='/api/v2')
app.include_router(trendRouter, tags=['Trend'], prefix='/api/v2')
app.include_router(customshapeRouter, tags=['Custom shape'], prefix='/api/v2')
app.include_router(customdistrictRouter, tags=['District Name'], prefix='/api/v2')
app.include_router(layerdetailsRouter, tags=['Layer meta'], prefix='/api/v2')
app.include_router(rasterRouter, tags=['Raster'], prefix='/api/v2')
app.include_router(currentlayerRouter, tags=['Current'], prefix='/api/v2')
app.include_router(usecaseRouter, tags=['Usecases'], prefix='/api/v2')
app.include_router(downloadRoute, tags=['Downloads'], prefix='/api/v2')
app.include_router(lulcRoute, tags=['LULC'], prefix='/api/v2')
app.include_router(warehouseRouter, tags=['Warehouse'], prefix='/api/v2')
app.include_router(cropfireRouter, tags=['Cropfire'], prefix='/api/v2')
app.include_router(pixelRouter, tags=['Pixel'], prefix='/api/v2')
