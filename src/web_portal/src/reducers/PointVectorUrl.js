function setPointVectorUrlReducer(
    state ={
      url: ""
    },
    action
  ) {
    switch (action.type) {
      case "SETPOINTLAYERURL":
        return (state = action.payload);
      default:
        return state;
    }
  }
  export default setPointVectorUrlReducer;