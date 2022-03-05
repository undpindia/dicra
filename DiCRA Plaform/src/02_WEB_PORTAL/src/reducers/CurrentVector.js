const setCurrentVectorReducer = (state = [], action) => {
    switch (action.type) {
      case "SETCURRENTVECTOR":
        return (state = action.payload);
      default:
        return state;
    }
  };

  export default setCurrentVectorReducer;
  