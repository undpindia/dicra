const checkCurrentUserSession = (
  state = {
    isVisited: false,
  },
  action
) => {
  switch (action.type) {
    case 'CHECKCURRENTUSERSESSION':
      return (state = action.payload);
    default:
      return state;
  }
};

export default checkCurrentUserSession;
