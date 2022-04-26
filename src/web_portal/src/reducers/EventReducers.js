function eventsReducer(state = [], action){
    switch (action.type){
       case "add_event":
          return [...state, action.payload]
       default:
          return state
    }
 }
 export default eventsReducer