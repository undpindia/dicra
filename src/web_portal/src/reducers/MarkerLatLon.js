const setmarkerlatlonReducer = (state = [0,0], action) => {
  switch (action.type) {
    case 'ADD_MARKER':
      return (state = action.payload);
    case 'REMOVE_MARKER':
        return (state = action.payload);
    default:
      return state;
  }
};

export default setmarkerlatlonReducer;
