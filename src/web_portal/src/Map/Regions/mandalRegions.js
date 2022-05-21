import mandalList from "./Shapefiles/TS_mandal_boundary.json";
export default function mandalRegions() {
  var regions = [];

  mandalList.features.map((data) =>
    regions.push({
      uid: data.properties.uid,
      dname: data.properties.Mandal_Nam,
      centerPoint: data.properties.centroid,
    })
  );

  return regions;
}
