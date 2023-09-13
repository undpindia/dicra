const setlulcpercentageReducer = (state = [{
    "1": "Water",
    "2": "Trees",
    "4": "Flooded_vegetation",
    "5": "Crops",
    "7": "Built_Area",
    "8": "Bare_ground",
    "9": "Snow_or_Ice",
    "10": "Clouds",
    "11": "Rangeland"
}], action) => {
    switch (action.type) {
      case "SETLULCPERCENTAGE":
        return (state = action.payload);
      default:
        return state;
    }
  };
  
  export default setlulcpercentageReducer;
  