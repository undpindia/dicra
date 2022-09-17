const setDevColorReducer = (
    state = [
    '#a50026',
    '#d73027', 
    '#f46d43',
    '#fdae61', 
    '#fee08b', 
    '#ffffbf', 
    '#d9ef8b',
    '#a6d96a',
    '#66bd63',
    '#1a9850', 
    '#006837'],
    action
  ) => {
    switch (action.type) {
      case "SETDEVCOLOR_SCALE":
        return (state = action.payload);
      default:
        return state;
    }
  };
  
  export default setDevColorReducer;