const setColorReducer = (state = [
    "#fafa6e",
    "#bdea75",
    "#86d780",
    "#54c18a",
    "#23aa8f",
    "#00918d",
    "#007882",
    "#1f5f70",
    "#2a4858"
  ], action) => {
      switch (action.type) {
        case "SETCOLOR_SCALE":
          return (state = action.payload);
        default:
          return state;
      }
    };
    
    export default setColorReducer;
    