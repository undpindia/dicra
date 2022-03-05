const setLayerDateReducer = (state = "", action) => {
    switch (action.type) {
      case "SETLAYERDATE":
        return (state = action.payload);
      default:
        return state;
    }
  };
  
  export default setLayerDateReducer;
  