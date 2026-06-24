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
     else if(action.type === "loading"){
        return {...state, loading:true}
    }
     else if(action.type === "loading_done"){
        return {...state, loading:false}
    }
    return state
}

export default reducer