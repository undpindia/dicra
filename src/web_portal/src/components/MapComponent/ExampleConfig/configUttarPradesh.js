import img from "../../../assets/images/partners/up-gov.png";
import districtList from "../Map/Regions/Shapefiles/up_district_boundary.json";
import mandalList from "../Map/Regions/Shapefiles/up_sdistrict_boundary.json";

const config = {
    state: "Uttar Pradesh",
    regionID: 8,
    stateImage: img,
    latnew: 27.5706,
    longnew: 80.0982,
    locpointerltlng: [60.732421875, 80.67555881973475],
    loaderlatvector: 17.754639747121828,
    loaderlngvector: 79.05833831966801,
    loaderlatraster: 17.754639747121828,
    loaderlngraster: 79.05833831966801,
    districtList: districtList,
    mandalList: mandalList,
    ndvi_dppd: 25,
    ssm_dppd: 189,
    no2_dppd: 192,
    lai_dppd: 198,
    lst_dppd: 187,
    pm25_dppd: 188,
    ndwi_dppd: 190,
    DPPD: [-0.1,0.2],
    SOIL_M_DEV: [-0.001, 0.0005],
    NDWI_DPPD: [-0.00001, 0.00001],
    LAI_DPPD: [-0.000014, 0.000032],
    LST_DPPD: [-0.1,0.04],
    NDVI_DPPD: [-0.000010,0.0000100]
}
export default config