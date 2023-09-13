import districtList from "../Map/Regions/Shapefiles/uk_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/uk_sdistrict_boundary.json";
import img from "../../../assets/images/Uttarakhand-govt.png";
const config = {
    state: "Uttarakhand",
    regionID: 2,
    stateImage: img,
    latnew: 30.321989,
    longnew: 79.195412,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 30.24,
    loaderlngvector: 79.07,
    loaderlatraster: 30.24,
    loaderlngraster: 79.07,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 18,
    ssm_dppd: 61,
    no2_dppd: 82,
    lai_dppd: 26,
    lst_dppd: 57,
    pm25_dppd: 53,
    ndwi_dppd: 65
}
export default config