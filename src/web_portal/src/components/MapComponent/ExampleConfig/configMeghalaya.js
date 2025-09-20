import img from "../../../assets/images/meghalaya-logo.png";
import districtList from "../Map/Regions/Shapefiles/ml_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/ml_sdistrict_boundary.json";

const config = {
    state: "Meghalaya",
    regionID: 19,
    stateImage: img,
    latnew: 25.6670,
    longnew: 91.3662,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 17.754639747121828,
    loaderlngvector: 79.05833831966801,
    loaderlatraster: 17.754639747121828,
    loaderlngraster: 79.05833831966801,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 213,
    ssm_dppd: 267,
    no2_dppd: 249,
    lai_dppd: 225,
    lst_dppd: 231,
    pm25_dppd: 243,
    ndwi_dppd: 225,
    DPPD: [-0.1,0.2],
    SOIL_M_DEV: [-0.001, 0.0005],
    NDWI_DPPD: [-0.00001, 0.00001],
    LAI_DPPD: [-0.000014, 0.000032],
    LST_DPPD: [-0.1,0.04],
    NDVI_DPPD: [-0.000010,0.0000100]
}
export default config

