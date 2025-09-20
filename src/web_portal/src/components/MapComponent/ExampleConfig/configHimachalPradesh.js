import img from "../../../assets/images/himachal-logo.png";
import districtList from "../Map/Regions/Shapefiles/hp_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/hp_sdistrict_boundary.json";

const config = {
    state: "Himachal Pradesh",
    regionID: 18,
    stateImage: img,
    latnew: 32.1024,
    longnew: 77.5619,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 17.754639747121828,
    loaderlngvector: 79.05833831966801,
    loaderlatraster: 17.754639747121828,
    loaderlngraster: 79.05833831966801,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 212,
    ssm_dppd: 266,
    no2_dppd: 248,
    lai_dppd: 218,
    lst_dppd: 230,
    pm25_dppd: 242,
    ndwi_dppd: 224,
    DPPD: [-0.1,0.2],
    SOIL_M_DEV: [-0.001, 0.0005],
    NDWI_DPPD: [-0.00001, 0.00001],
    LAI_DPPD: [-0.000014, 0.000032],
    LST_DPPD: [-0.1,0.04],
    NDVI_DPPD: [-0.000010,0.0000100]
}
export default config