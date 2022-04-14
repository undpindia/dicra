const setLayerRegionReducer = (state = "DISTRICT", action) => {
    switch (action.type) {
      case "SETLAYERREGION":
        return (state = action.payload);
      default:
        return state;
    }
  };
  
  export default setLayerRegionReducer;
  