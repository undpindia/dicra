const setreversedgeocodeReducer = (state = '', action) => {
  switch (action.type) {
    case 'SETREVERSEDGEOCODE':
      return (state = action.payload);
    default:
      return state;
  }
};

export default setreversedgeocodeReducer;
