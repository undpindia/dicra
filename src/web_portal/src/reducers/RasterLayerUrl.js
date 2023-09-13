function setRasterLayerUrlReducer(
    state ={
      url: ""
    },
    action
  ) {
    switch (action.type) {
      case "SETRASTERLAYERURL":
        return (state = action.payload);
      default:
        return state;
    }
  }
  export default setRasterLayerUrlReducer;
  