function DownLayerDescription(
  state = {
    color: "spectral",
    yaxislabel: "NDVI",
    layer_name: "NDVI",
    isavailable: true,
    update_frequnecy: 0,
    xaxislabel: "Date/Time",
    citation:
      " Didan, K. (2015). MOD13A1 MODIS/Terra Vegetation Indices 16-Day L3 Global 500m SIN Grid V006 [Data set]. NASA EOSDIS Land Processes DAAC. Accessed 2022-04-12 from https://doi.org/10.5067/MODIS/MOD13A1.006",
    short_description: "Normalized difference vegetation index",
    last_updated: "2022-05-08T00:00:00",
    long_description:
      " NDVI quantifies vegetation by measuring the difference between near-infrared (which vegetation strongly reflects) and red light (which vegetation absorbs)",
    standards:
      " All data distributed by the LP DAAC contain no restrictions on the data reus",
    raster_status: true,
    source: "GLAM NDVIDB",
    timerangefilter: true,
    vector_status: true,
    url: "https://pekko.geog.umd.edu/usda/beta/",
    showcustom: null,
    multiple_files: true,
    unit: "",
    datafromvector: null,
    display_name: "Normalized Difference Vegetation Index (NDVI)",
    id: 2,
    category: "SOCIO-ECONOMIC",
  },
  action
) {
  switch (action.type) {
    case "DOWNCHANGELAYERDESC":
      return (state = action.payload);
    default:
      return state;
  }
}
export default DownLayerDescription;
