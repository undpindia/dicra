import districtList from "../Map/Regions/Shapefiles/jh_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/jh_sdistrict_boundary.json";
import img1 from "../../../assets/images/jharkhand.png";
const config = {
    state: "Jharkhand",
    regionID: 4,
    stateImage: img1,
    latnew: 23.344315,
    longnew: 85.296013,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 23.40,
    loaderlngvector: 85.14,
    loaderlatraster: 23.40,
    loaderlngraster: 85.14,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 22,
    ssm_dppd: 63,
    no2_dppd: 84,
    lai_dppd: 28,
    lst_dppd: 59,
    pm25_dppd: 55,
    ndwi_dppd: 67
}
export default config