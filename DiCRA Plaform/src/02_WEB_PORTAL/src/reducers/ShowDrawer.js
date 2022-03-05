const showDrawerReducer = (state = false, action) => {
  switch (action.type) {
    case "SHOWDRAWER":
      return (state = true);
    case "HIDEDRAWER":
      return (state = false);
    default:
      return state;
  }
};

export default showDrawerReducer;
