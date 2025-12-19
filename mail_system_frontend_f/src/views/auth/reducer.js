const reducer = (state, action)=>{
    if(action.type === "username"){
        return {...state, username:action.payload}
    }
    else if(action.type === "email"){
        return {...state, email:action.payload}
    }
    else if(action.type === "password"){
        return {...state, password:action.payload}
    }
    return state
}

export default reducer