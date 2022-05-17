import districtList from "./Shapefiles/TS_district_boundary.json";
export default function districtRegions() {
  var regions = [];

  districtList.features.map((data) => 
    regions.push({
      uid: data.properties.uid,
      dname: data.properties.Dist_Name,
      centerPoint: data.properties.centroid,
    })
  );

  return regions;
}
