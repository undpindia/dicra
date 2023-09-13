const showDrawerReducer = (state = false, action) => {
  switch (action.type) {
    case "SHOWDRAWER":
      return (state = action.payload);
    default:
      return state;
  }
};

export default showDrawerReducer;
