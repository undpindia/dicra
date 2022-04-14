function KeyMapReducer(state = 1, action) {
    switch (action.type) {
      case "CHANGEKEYMAP":
        return (state = state+1);    
      default:
        return state;
    }
  }
  export default KeyMapReducer;
  