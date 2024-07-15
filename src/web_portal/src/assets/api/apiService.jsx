import { json } from "react-router-dom";
import ApiHelper from "./apiHelper";

/* Usecases */

export const usecases = (data) => {
    return ApiHelper.get(`${process.env.REACT_APP_APIEND}/usecases`);
};

/* Get LAYERS */

export const getlayers = (data) => {
    return ApiHelper.get(`${process.env.REACT_APP_APIEND}getlayerconfig?regionid=` + data);
};


// Get Raster
export const getraster = (data) => {
    return ApiHelper.get(`${process.env.REACT_APP_APIEND}getrastorurl?layerid=` + data);
};


// Get zstat
export const getzstat = (data) => {
    return ApiHelper.post(`${process.env.REACT_APP_APIEND}getzstat`, data);
};

// Get LatetstDate
export const getlatestdate = (data) => {
    return ApiHelper.get(`${process.env.REACT_APP_APIEND}getlatestdate?layerid=` + data);
};

//Get Trend

export const gettrend = (data) => {
    return ApiHelper.post(`${process.env.REACT_APP_APIEND}gettrend`, data);
};

// Get Raster
export const getdownloadfiles = (data) => {
    return ApiHelper.get(`${process.env.REACT_APP_APIEND}getfilenames?layerId=` + data);
};

//Get LULC Area

export const getlulcarea = (data) => {
    return ApiHelper.post(`${process.env.REACT_APP_APIEND}getlulcarea`, data);
};

//Get LULC Percentage

export const getlulcpercentage = (data) => {
    return ApiHelper.post(`${process.env.REACT_APP_APIEND}getlulcareapercentage`, data);
};

//Get LULC Trend

export const getlulctrend = (data) => {
    return ApiHelper.post(`${process.env.REACT_APP_APIEND}getlulctrend`, data);
};

//Get Point Trend
export const getpointtrend = (data) => {
    return ApiHelper.post(`${process.env.REACT_APP_APIEND}getppointtrend`, data);
};

//Get Layer Percentage

export const getlayerpercentage = (data) => {
    return ApiHelper.post(`${process.env.REACT_APP_APIEND}getlayerpercentage`, data);
};

//Get Crop Fire

export const getcropfire = (data) => {
    return ApiHelper.get(`${process.env.REACT_APP_APIEND}cropfire?layer_id=`, data);
};

//Get Crop Fire Point

export const getcfpoint = (data) => {
    return ApiHelper.post(`${process.env.REACT_APP_APIEND}cropfiregetpoint`, data);
};

//Get Crop Fire Trend

export const getcftrend = (data) => {
    return ApiHelper.post(`${process.env.REACT_APP_APIEND}cropfireeventstrend`, data);
};

//Get Pixel Value
export const getpixel = (data) => {
    return ApiHelper.post(`${process.env.REACT_APP_APIEND}getpixel`, data);
};
