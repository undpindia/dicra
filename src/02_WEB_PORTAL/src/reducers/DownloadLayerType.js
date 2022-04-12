const setLayerTypeReducer = (state = "Raster", action) => {
    switch (action.type) {
      case "SETLAYERTYPE":
        return (state = action.payload);
      default:
        return state;
    }
  };
  
  export default setLayerTypeReducer;
  