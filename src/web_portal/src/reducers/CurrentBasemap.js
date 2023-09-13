const setCurrentBasemapReducer = (state = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", action) => {
    switch (action.type) {
      case "SETCURRRENTBASEMAP":
        return (state = action.payload);
      default:
        return state;
    }
  };

  export default setCurrentBasemapReducer;