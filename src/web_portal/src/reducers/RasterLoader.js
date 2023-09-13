const setrasterloader = (state = [40.730610, -73.935242], action) => {
    switch (action.type) {
        case "SETRASLATLON":
            return (state = action.payload);
        default:
            return state;
    }
};

export default setrasterloader;