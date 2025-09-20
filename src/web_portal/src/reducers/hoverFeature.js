function setHoverFeature(state = null, action) {
  switch (action.type) {
    case "SETHOVERFEATURE":
      return action.payload; 
    default:
      return state;
  }
}
export default setHoverFeature;
