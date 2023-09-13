const setcroppercentageReducer = (state = [{
    "1": "Water",
    "2": "Trees",
    "3": "Flooded_vegetation",
    "4": "Crops",
}], action) => {
    switch (action.type) {
      case "SETCROPPERCENTAGE":
        return (state = action.payload);
      default:
        return state;
    }
  };
  
  export default setcroppercentageReducer;
  