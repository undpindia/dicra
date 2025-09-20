const showLoaderReducer = (state = true, action) => {
  switch (action.type) {
    case "SHOWLOADER":
      return (state = action.payload);
    default:
      return state;
  }
};

export default showLoaderReducer;
