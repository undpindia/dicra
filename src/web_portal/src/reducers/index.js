import setplaceReducer from './setplacename';
import setColorReducer from './setColorReducer';
import setvalueReducer from './setvalue';
import setLayerList from './setLayerReducers';
import setDownloadLayer from './DownloadLayer';
import setDownloadLayerDate from './DownloadLayerDate';
import setDownloadLayerRegion from './DownloadLayerRegion';
import setDownloadLayerType from './DownloadLayerType';
import setCurrentLayer from './CurrentLayerReducer';
import setRasterLoader from './LoaderRasterReducer';
import setVectorLoader from './LoaderVectorReducer';
import setCurrentVector from './CurrentVector';
import setCurrentRegion from './CurrentRegion';
import setKeyMap from './KeyMapReducer';
import setLayerDesc from './LayerDescription';
import setDownLayerDesc from './DownloadLayerDesc';
import drawerChange from './ShowDrawer';
import changeOpacity from './RasterOpacity';
import setDownloadFile from './DownloadFile';
import currentLayerType from './currentLayerType';
import hoverlatlon from './setlatlon';
import setDevCFColorReducer from './setDevCFColorReducer';
import setDevColorReducer from './setDevColorReducer';
import { combineReducers } from 'redux';
import setRasterLayerUrlReducer from './RasterLayerUrl';
import setCurrentDateReducer from './currentLayerDate';
import RasterLoader from './RasterLoader';
import checkCurrentUserSession from './checkCurrentUserSession';
import CustomStatusReducer from './CustomStatus';
import setCurrentBasemapReducer from './CurrentBasemap';
import setCurrentBasemapTypeReducer from './CurrentBasemapType';
import ShowLayerTypeReducer from './ShowLayerType';
import setmarkerlatlonReducer from './MarkerLatLon';
import setpixelvalueReducer from './setPixelValue';
import SetSelecterCategory from './SetSelecterCategory';
import SetSelecterCategoryId from './SetSelectedCategoryId';
import checkIsShapeSelectedReducer from './checkIsShapeSelected';
import setlulcpercentageReducer from './LulcPercentage';
import setreversedgeocodeReducer from './setreversedgeocodeReducer';
import setcroppercentageReducer from './CropPercentage';

const allReducers = combineReducers({
  setval: setvalueReducer,
  setplace: setplaceReducer,
  Layers: setLayerList,
  DownloadLayer: setDownloadLayer,
  DownloadLayerDate: setDownloadLayerDate,
  DownloadLayerRegion: setDownloadLayerRegion,
  DownloadLayerType: setDownloadLayerType,
  CurrentLayer: setCurrentLayer,
  RasterLoader: setRasterLoader,
  VectorLoader: setVectorLoader,
  CurrentVector: setCurrentVector,
  CurrentRegion: setCurrentRegion,
  MapKey: setKeyMap,
  SetColor: setColorReducer,
  SetDevCFColor: setDevCFColorReducer,
  SetDevColor: setDevColorReducer,
  LayerDescription: setLayerDesc,
  DownloadLayerDesc: setDownLayerDesc,
  ShowDrawer: drawerChange,
  RasterOpacity: changeOpacity,
  DownloadFile: setDownloadFile,
  CurrentLayerType: currentLayerType,
  Hoverlatlon: hoverlatlon,
  RasterLayerUrl: setRasterLayerUrlReducer,
  setCurrentDate: setCurrentDateReducer,
  loaderraster: RasterLoader,
  checkCurrentUserSession: checkCurrentUserSession,
  customstatus: CustomStatusReducer,
  currentbasemapurl: setCurrentBasemapReducer,
  currentbasemaptype: setCurrentBasemapTypeReducer,
  showlayertype: ShowLayerTypeReducer,
  markerLatLon: setmarkerlatlonReducer,
  pixelvalue: setpixelvalueReducer,
  SelecterCategory: SetSelecterCategory,
  SelecterCategoryId: SetSelecterCategoryId,
  checkIsShapeSelected: checkIsShapeSelectedReducer,
  setLulcPercentage: setlulcpercentageReducer,
  setReversedGeocode: setreversedgeocodeReducer,
  setCropPercentage: setcroppercentageReducer,
});
export default allReducers;
