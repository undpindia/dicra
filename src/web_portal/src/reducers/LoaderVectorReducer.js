function loaderVectorReducer(state = false, action) {
  switch (action.type) {
    case "ENABLEVECTOR":
      return (state = true);
    case "DISABLEVECTOR":
      return (state = false);
    default:
      return state;
  }
}
export default loaderVectorReducer;
