const setCurrentRegionReducer = (state = "DISTRICT", action) => {
    switch (action.type) {
      case "SETCURRENTREGION":
        return (state = action.payload);
      default:
        return state;
    }
  };

  export default setCurrentRegionReducer;
  