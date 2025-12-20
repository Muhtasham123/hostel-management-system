const reducer = (state, action)=>{
    if(action.type === "get"){
        return {...state, hostels:action.payload}
    }
}

export default reducer