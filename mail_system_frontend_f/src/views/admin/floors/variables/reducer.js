const reducer = (state, action)=>{
    if(action.type === "get"){
        return {...state, floors:action.payload}
    }
    else if(action.type === "add"){
        return {...state, refreshFloors:state.refreshFloors + 1}
    }
    else if(action.type === "edit"){
        return {...state, refreshFloors:state.refreshFloors + 1}
    }
    else if(action.type === "delete"){
        return {...state, refreshFloors:state.refreshFloors + 1}
    }
    
    else if(action.type === "close_model"){
        return {...state, isModelOpen:false}
    }
    else if(action.type === "close_delete_model"){
        return {...state, isDeleteModelOpen:false}
    }
    else if(action.type === "open_model"){
        return {...state, isModelOpen:true, floorId:action.payload.floorId, editFloorNumber:action.payload.floorNumber}
    }
    else if(action.type === "open_delete_model"){
        return {...state, isDeleteModelOpen:true, floorId:action.payload.floorId}
    }
    else if(action.type === "change_edit_floor"){
        return {...state, editFloorNumber:action.payload}
    }
    return state
}

export default reducer