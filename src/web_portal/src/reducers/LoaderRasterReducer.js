function loaderRasterReducer(state = false, action) {
    switch (action.type) {
      case "ENABLERASTER":
        return (state = true);
      case "DISABLERASTER":
        return (state = false);
      default:
        return state;
    }
  }
  export default loaderRasterReducer;
  