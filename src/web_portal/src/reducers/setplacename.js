const setplaceReducer = (state = '', action) => {
  switch (action.type) {
    case "SETPLACE":
      return (state = action.payload);
    default:
      return state;
  }
};

export default setplaceReducer;
