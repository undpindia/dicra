import img from "../../../assets/images/madhyapradesh-logo.png";
import districtList from "../Map/Regions/Shapefiles/mp_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/mp_sdistrict_boundary.json";

const config = {
    state: "Madhya Pradesh",
    regionID: 20,
    stateImage: img,
    latnew: 23.9734,
    longnew: 78.1569,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 17.754639747121828,
    loaderlngvector: 79.05833831966801,
    loaderlatraster: 17.754639747121828,
    loaderlngraster: 79.05833831966801,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 214,
    ssm_dppd: 268,
    no2_dppd: 250,
    lai_dppd: 220,
    lst_dppd: 232,
    pm25_dppd: 244,
    ndwi_dppd: 226,
    DPPD: [-0.1,0.2],
    SOIL_M_DEV: [-0.001, 0.0005],
    NDWI_DPPD: [-0.00001, 0.00001],
    LAI_DPPD: [-0.000014, 0.000032],
    LST_DPPD: [-0.1,0.04],
    NDVI_DPPD: [-0.000010,0.0000100]
}
export default config