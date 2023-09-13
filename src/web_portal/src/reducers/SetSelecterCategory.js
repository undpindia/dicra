const SetSelecterCategory = (state = '', action) => {
  switch (action.type) {
    case 'SETSELECTERCATEGORY':
      return (state = action.payload);
    default:
      return state;
  }
};

export default SetSelecterCategory;
