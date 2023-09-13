import districtList from "../Map/Regions/Shapefiles/od_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/od_sdistrict_boundary.json";
import img from "../../../assets/images/odisha-govt.jpg";
const config = {
    state: "Odisha",
    regionID: 7,
    stateImage: img,
    latnew: 20.50,
    longnew: 84.18,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 20.57,
    loaderlngvector: 84.32,
    loaderlatraster: 20.57,
    loaderlngraster: 84.32,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 20,
    ssm_dppd: 45,
    no2_dppd: 83,
    lai_dppd: 21,
    lst_dppd: 43,
    pm25_dppd: 46,
    ndwi_dppd: 44
}
export default config