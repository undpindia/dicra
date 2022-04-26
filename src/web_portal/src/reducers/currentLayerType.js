const setCurrentLayerTypeReducer = (state = "Raster", action) => {
    switch (action.type) {
      case "SETCURRRENTLAYERTYPE":
        return (state = action.payload);
      default:
        return state;
    }
  };

  export default setCurrentLayerTypeReducer;
  