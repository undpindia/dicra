import districtList from "../Map/Regions/Shapefiles/mh_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/mh_sdistrict_boundary.json";
import img from "../../../assets/images/maharashtra-govt.png";
const config = {
    state: "Maharashtra",
    regionID: 3,
    stateImage: '',
    latnew: 19.663280,
    longnew: 75.300293,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 19.29,
    loaderlngvector: 75.59,
    loaderlatraster: 19.29,
    loaderlngraster: 75.59,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 19,
    ssm_dppd: 62,
    no2_dppd: 105,
    lai_dppd: 27,
    lst_dppd: 58,
    pm25_dppd: 54,
    ndwi_dppd: 66
}
export default config