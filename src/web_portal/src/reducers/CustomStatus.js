const CustomStatusReducer = (state = false, action) => {
    switch (action.type) {
      case "SETCUSTOMSTATUS":
        return (state = action.payload);
      default:
        return state;
    }
  };

export default CustomStatusReducer;