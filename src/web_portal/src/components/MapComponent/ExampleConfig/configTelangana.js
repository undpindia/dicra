import img from "../../../assets/images/telangana.png";
import districtList from "../Map/Regions/Shapefiles/TS_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/TS_mandal_boundary.json";

const config = {
    state: "Telangana",
    regionID: 1,
    stateImage: img,
    latnew: 18.1124,
    longnew: 79.0193,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 17.754639747121828,
    loaderlngvector: 79.05833831966801,
    loaderlatraster: 17.754639747121828,
    loaderlngraster: 79.05833831966801,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 2,
    ssm_dppd: 6,
    no2_dppd: 8,
    lai_dppd: 3,
    lst_dppd: 7,
    pm25_dppd: 9,
    ndwi_dppd: 40
}
export default config