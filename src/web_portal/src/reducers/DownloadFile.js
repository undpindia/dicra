const setDownFileReducer = (state = "", action) => {
    switch (action.type) {
      case "SETDOWNLOADFILE":
        return (state = action.payload);
      default:
        return state;
    }
  };
  
  export default setDownFileReducer;
  