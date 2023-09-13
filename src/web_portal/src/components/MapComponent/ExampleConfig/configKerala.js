import districtList from "../Map/Regions/Shapefiles/kl_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/kl_sdistrict_boundary.json";
import img from "../../../assets/images/kerala-govt.png";
const config = {
    state: "Kerala",
    regionID: 6,
    stateImage: '',
    latnew: 10.850516,
    longnew: 76.271080,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 10.80,
    loaderlngvector: 76.32,
    loaderlatraster: 10.80,
    loaderlngraster: 76.32,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 24,
    ssm_dppd: 64,
    no2_dppd: 104,
    lai_dppd: 30,
    lst_dppd: 60,
    pm25_dppd: 56,
    ndwi_dppd: 68
}
export default config