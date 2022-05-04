const setvalueReducer = (state = 0, action) => {
  switch (action.type) {
    case "SETVALUE":
      return (state = action.payload);
    default:
      return state;
  }
};

export default setvalueReducer;
