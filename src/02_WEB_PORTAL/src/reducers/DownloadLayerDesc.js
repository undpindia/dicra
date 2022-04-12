function DownLayerDescription(
  state = {
    id: 1,
    source: "GLAM NDVIDB",
    short_description: "Normalized difference vegetation index",
    unit: " ",
    update_frequnecy: 8,
    raster_status: true,
    multiple_files: true,
    long_description:
      "Normalized Difference Vegetation Index (NDVI) quantifies vegetation by measuring the difference between near-infrared (which vegetation strongly reflects) and red light (which vegetation absorbs)",
    layer_name: "NDVI",
    url: "www.source.com",
    color: "spectral",
    last_updated: "2021-09-13T00:00:00",
    vector_status: true,
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
