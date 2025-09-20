import img from "../../../assets/images/andhra-logo.png";
import districtList from "../Map/Regions/Shapefiles/ap_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/ap_sdistrict_boundary.json";

const config = {
    state: "Andhra Pradesh",
    regionID: 16,
    stateImage: img,
    latnew: 15.9129,
    longnew: 79.7400,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 17.754639747121828,
    loaderlngvector: 79.05833831966801,
    loaderlatraster: 17.754639747121828,
    loaderlngraster: 79.05833831966801,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 210,
    ssm_dppd: 264,
    no2_dppd: 246,
    lai_dppd: 216,
    lst_dppd: 228,
    pm25_dppd: 240,
    ndwi_dppd: 222,
    DPPD: [-0.1,0.2],
    SOIL_M_DEV: [-0.001, 0.0005],
    NDWI_DPPD: [-0.00001, 0.00001],
    LAI_DPPD: [-0.000014, 0.000032],
    LST_DPPD: [-0.4,0.4],
    NDVI_DPPD: [-0.000010,0.0000100]
}
export default config