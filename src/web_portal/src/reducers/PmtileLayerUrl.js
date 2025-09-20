function setPmtileLayerUrlReducer(
    state ={
      url: ""
    },
    action
  ) {
    switch (action.type) {
      case "SETPMTILELAYERURL":
        return (state = action.payload);
      default:
        return state;
    }
  }
  export default setPmtileLayerUrlReducer;