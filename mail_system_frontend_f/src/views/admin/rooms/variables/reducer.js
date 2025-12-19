const reducer = (state, action)=>{
    if(action.type === "get"){
        return {...state, rooms:action.payload}
    }
    else if(action.type === "get_floors"){
        if(action.payload.length > 0){
            return {...state, floors:action.payload, selectedFloor:action.payload[0].number}
        }
        return {...state, floors:action.payload}

    }
    else if(action.type === "add"){
        return {...state, refreshRooms:state.refreshRooms + 1}
    }
    else if(action.type === "edit"){
        return {...state, refreshRooms:state.refreshRooms + 1}
    }
    else if(action.type === "delete"){
        return {...state, refreshRooms:state.refreshRooms + 1}
    }
    
    else if(action.type === "close_model"){
        return {...state, isModelOpen:false}
    }
    else if(action.type === "close_delete_model"){
        return {...state, isDeleteModelOpen:false}
    }
    else if(action.type === "close_add_model"){
        return {...state, isAddModelOpen:false}
    }
    else if(action.type === "open_model"){
        return {...state, isModelOpen:true, roomId:action.payload.id, roomNumber:action.payload.number, seats:action.payload.seats, selectedFloor:action.payload.floor_number}
    }
    else if(action.type === "open_delete_model"){
        return {...state, isDeleteModelOpen:true, roomId:action.payload.roomId}
    }
    else if(action.type === "open_add_model"){
        return {...state, isAddModelOpen:true}
    }
    else if(action.type === "change_room_number"){
        return {...state, roomNumber:action.payload}
    }
    else if(action.type === "change_seats"){
        return {...state, seats:action.payload}
    }
    else if(action.type === "change_floor"){
        return {...state, selectedFloor:action.payload}
    }
    return state
}

export default reducer