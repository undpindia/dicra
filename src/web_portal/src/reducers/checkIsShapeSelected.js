const checkIsShapeSelectedReducer = (state = false, action) => {
  switch (action.type) {
    case 'CHECKISSHAPESELECTED':
      return (state = action.payload);
    default:
      return state;
  }
};

export default checkIsShapeSelectedReducer;
