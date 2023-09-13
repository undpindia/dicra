import districtList from "../Map/Regions/Shapefiles/gj_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/gj_sdistrict_boundary.json";
import img from "../../../assets/images/gujarat-govt.png";
const config = {
    state: "Gujarat",
    regionID: 5,
    stateImage: '',
    latnew: 22.309425,
    longnew: 72.136230,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 22.66,
    loaderlngvector: 71.80,
    loaderlatraster: 22.66,
    loaderlngraster: 71.80,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 23,
    ssm_dppd: 50,
    no2_dppd: 106,
    lai_dppd: 29,
    lst_dppd: 51,
    pm25_dppd: 108,
    ndwi_dppd: 49
}
export default config