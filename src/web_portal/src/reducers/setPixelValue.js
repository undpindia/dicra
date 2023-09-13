const setpixelvalueReducer = (state = 0, action) => {
    switch (action.type) {
      case "SETPIXELVALUE":
        return (state = action.payload);
      default:
        return state;
    }
  };
  
  export default setpixelvalueReducer;
  