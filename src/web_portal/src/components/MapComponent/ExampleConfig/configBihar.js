import img from "../../../assets/images/bihar-logo.png";
import districtList from "../Map/Regions/Shapefiles/bh_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/bh_sdistrict_boundary.json";

const config = {
    state: "Bihar",
    regionID: 17,
    stateImage: img,
    latnew: 25.9644,
    longnew: 85.2722,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 17.754639747121828,
    loaderlngvector: 79.05833831966801,
    loaderlatraster: 17.754639747121828,
    loaderlngraster: 79.05833831966801,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 211,
    ssm_dppd: 265,
    no2_dppd: 247,
    lai_dppd: 217,
    lst_dppd: 229,
    pm25_dppd: 241,
    ndwi_dppd: 223,
    SOIL_M_DEV: [-0.001, 0.0005],
    NDWI_DPPD: [-0.00001, 0.00001],
    LAI_DPPD: [-0.000014, 0.000032],
    LST_DPPD: [-0.4,0.4],
    NDVI_DPPD: [-0.000010,0.0000100]
}
export default config