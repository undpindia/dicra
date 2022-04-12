const setLayerReducer = (state = [], action) => {
    switch (action.type) {
      case "SETLAYERLIST":
        return (state = action.payload);
      default:
        return state;
    }
  };
  
  export default setLayerReducer;
  