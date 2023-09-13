const SetSelecterCategoryId = (state = '', action) => {
  switch (action.type) {
    case 'SETSELECTERCATEGORYID':
      return (state = action.payload);
    default:
      return state;
  }
};

export default SetSelecterCategoryId;
