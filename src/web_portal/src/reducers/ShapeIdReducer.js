const ShapeIdReducer = (state = "", action) => {
    switch (action.type) {
      case "SETSHAPEID":
        return (state = action.payload);
      default:
        return state;
    }
  };
  
export default ShapeIdReducer;
