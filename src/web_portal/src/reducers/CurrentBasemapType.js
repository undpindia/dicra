const setCurrentBasemapTypeReducer = (state = "Dark", action) => {
    switch (action.type) {
      case "SETCURRRENTBASEMAPTYPE":
        return (state = action.payload);
      default:
        return state;
    }
  };

  export default setCurrentBasemapTypeReducer;