const setplaceReducer = (state = 0, action) => {
  switch (action.type) {
    case "SETPLACE":
      return (state = action.payload);
    default:
      return state;
  }
};

export default setplaceReducer;
