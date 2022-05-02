const setlatlonReducer = (state = ["0,0"], action) => {
  switch (action.type) {
    case "SETLATLON":
      return (state = action.payload);
    default:
      return state;
  }
};

export default setlatlonReducer;
