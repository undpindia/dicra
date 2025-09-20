import Config from '../Config/config';


export const DOMAIN_LOOKUP = {
  NDVI: [-1, 1],
  NDWI: [-1, 1],
  LAI: [0, 10],
  LST: [1, 50],
  LULC: [1, 11],
  POPULATION: [1, 50000],
  crop_intensity: [1, 4],
  crop_land: [1,2],
  crop_stress: [1,7],
  crop_type: [1,13],
  SOILM: [0,1],
  "Temp - Monthly Avg.": [1,50],
  PM25: [1,50],
  "Total Precipitation - Monthly": [0,10],
  SOC: [0,500],
  DPPD: [-0.1,0.2],
  SOIL_M_DEV: [-0.001, 0.0005],
  NDWI_DPPD: Config.NDWI_DPPD,
  LAI_DPPD: Config.LAI_DPPD,
  LST_DPPD: Config.LST_DPPD,
  NDVI_DPPD: Config.NDVI_DPPD,
  NO2_DPPD: [-1,1],
  PM25_DPPD: [0.0001,0.01]

};
export const DOMAIN_LOOKUP_DPPD = {
  DPPD: [-0.1,0.2],
  SOIL_M_DEV: [-1, 1],
  NDWI_DPPD: [-1, 1],
  LAI_DPPD: [-1, 1],
  LST_DPPD: [-1, 1],
  NDVI_DPPD: [-1, 1],
  NO2_DPPD: [-1,1],
  PM25_DPPD: [-1, 1],

};

export const LULC_COLORS = [
  "#1A5BAB", // Water
  "#358221", // Forest
  "#000000",
  "#87D19E", // Grass / Scrub
  "#FFDB5C", // Cropland
  "#ED022A", // Built‑up
  "#91908e", // Barren
  "#F2FAFF", // Snow / Ice
  "#C8C8C8", // Clouds
  "#C6AD8D", // Wetlands
];

export const CROP_INTENSITY = ["#e5e823", "#30e823", "#c726a1", "#bfbbbe"];

export const CROP_LAND = ["#30e823", "#bfbbbe"];

export const CROP_STRESS = [
  "#0c3816",
  "#e5e823",
  "#c97a20",
  "#992314",
  "#246e9c",
  "#04018a",
  "#bfbbbe",
];

export const CROP_TYPE_129 = [
  "#00FF01",
  "#A0522C",
  "#01FFFF",
  "#006401",
  "#FFFF01",
  "#EE82EF",
  "#FFC0CB",
  "#A020EF",
  "#FFFEDF",
  "#A52B2A",
  "#D1B48C",
  "#FFC0CB",
  "#C0C0C0",
];

export const CROP_TYPE_134 = [
  "#00FF01",
  "#80FF00",
  "#FFFF01",
  "#006401",
  "#01FFFF",
  "#FED700",
  "#D1B48C",
  "#FEA500",
  "#E0697B",
  "#A020EF",
  "#FF00FE",
  "#FFC0CB",
  "#FFFEDF",
  "#C0C0C0",
];

export const CROP_TYPE_135 = [
  "#00FF01",
  "#80FF00",
  "#F6F6DC",
  "#FFFF01",
  "#EE82EF",
  "#A020EF",
  // '#FFB6C1',
  "#e0697b",
  "#D1B48C",
  "#A52B2A",
  "#FFC0CB",
  "#F6F6DC",
  "#C0C0C0"
];
