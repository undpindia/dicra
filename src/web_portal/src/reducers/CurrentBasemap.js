const setCurrentBasemapReducer = (state = [
  "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
  "https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
  "https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
  "https://d.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
], action) => {
    switch (action.type) {
      case "SETCURRRENTBASEMAP":
        return (state = action.payload);
      default:
        return state;
    }
  };

  export default setCurrentBasemapReducer;