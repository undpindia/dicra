const setCurrentDateReducer = (state = "18-02-2023", action) => {
    switch (action.type) {
      case "SETCURRENTDATE":
        return (state = action.payload);
      default:
        return state;
    }
  };

  export default setCurrentDateReducer;
  