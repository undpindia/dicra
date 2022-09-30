const setDevCFColorReducer = (
  state = [
    '#006837',
    '#1a9850',
    '#66bd63', 
    '#a6d96a', 
    '#d9ef8b', 
    '#ffffbf', 
    '#fee08b',
    '#fdae61',
    '#f46d43', 
    '#d73027', 
    '#a50026',
  ],
  action
) => {
  switch (action.type) {
    case "SETDEVCFCOLOR_SCALE":
      return (state = action.payload);
    default:
      return state;
  }
};

export default setDevCFColorReducer;