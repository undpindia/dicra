function PointFeature(
  state = null,
  action
) {
  switch (action.type) {
    case "CHANGEPOINTFEATURES":
      return (state = action.payload);
    default:
      return state;
  }
}
export default PointFeature;