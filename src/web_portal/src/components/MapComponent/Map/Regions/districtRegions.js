import Config from "../../Config/config";

export default function districtRegions() {
  var regions = [];

  Config.districtList.features
    .map((data) => ({
      uid: data.properties.uid,
      dname: data.properties.district_name,
      centerPoint: data.properties.centroid,
    }))
    .sort((a, b) => a.dname.localeCompare(b.dname)) // Sort the regions alphabetically by district_name
    .forEach((region) => regions.push(region));

  return regions;
}