function LayerDescription(
  state = {

  },
  action
) {
  switch (action.type) {
    case "CHANGELAYERDESC":
      return (state = action.payload);
    default:
      return state;
  }
}
export default LayerDescription;
