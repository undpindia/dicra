const setCurrentLayerReducer = (state = "NDVI", action) => {
    switch (action.type) {
      case "SETCURRENTLAYER":
        return (state = action.payload);
      default:
        return state;
    }
  };

  export default setCurrentLayerReducer;
  