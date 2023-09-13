const ShowLayerTypeReducer = (state = true, action) => {
    switch (action.type) {
      case "SHOWLAYERTYPE":
        return (state = action.payload);
      default:
        return state;
    }
  };

export default ShowLayerTypeReducer;