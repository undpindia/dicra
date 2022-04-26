function rasterOpacityReducer(state = true, action) {
    switch (action.type) {
      case "SHOWRASTER":
        return (true)
        case "HIDERASTER":
          return (false)  
      default:
        return state;
    }
  }
  export default rasterOpacityReducer;
  