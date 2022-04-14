const setDownLayerReducer = (state = "NDVI", action) => {
    switch (action.type) {
      case "SETDOWNLOADLAYER":
        return (state = action.payload);
      default:
        return state;
    }
  };
  
  export default setDownLayerReducer;
  