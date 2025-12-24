const reducer = (state, action)=>{
    if(action.type === "get"){
        return {...state, members:action.payload}
    }
    else if(action.type === "get_roles"){
        return {...state, roles:action.payload, role:action.payload[0].role}
    }
    else if(action.type === "reset"){
        return {...state, name:null, email:null, role:null, roomNumber:null, phone:null, pass:null}
    }
    else if(action.type === "get_rooms"){
        return {...state, rooms:action.payload}
    }
     else if(action.type === "get_floors"){
        return {...state, floors:action.payload}
    }
    else if(action.type === "add"){
        return {...state, refreshMembers:state.refreshMembers + 1}
    }
    else if(action.type === "edit"){
        return {...state, refreshMembers:state.refreshMembers + 1}
    }
    else if(action.type === "delete"){
        return {...state, refreshMembers:state.refreshMembers + 1}
    }
    
    else if(action.type === "close_model"){
        return {...state, isModelOpen:false}
    }
    else if(action.type === "close_delete_model"){
        return {...state, isDeleteModelOpen:false}
    }
    else if(action.type === "close_add_model"){
        return {...state, isAddModelOpen:false, name:null, email:null, role:null, room:null}
    }
    else if(action.type === "close_scheduel_model"){
        return {...state, isScheduelModelOpen:false}
    }
    else if(action.type === "open_model"){
        return {...state, isModelOpen:true, 
            memberId:action.payload.id,
            name:action.payload.name,
            role:action.payload.role,
            email:action.payload.email,
            roomNumber:action.payload.room
        }
    }
    else if(action.type === "open_delete_model"){
        return {...state, isDeleteModelOpen:true, memberId:action.payload.memberId}
    }
    else if(action.type === "open_add_model"){
        return {...state, isAddModelOpen:true}
    }
    else if(action.type === "open_scheduel_model"){
        return {...state, isScheduelModelOpen:true}
    }
    else if(action.type === "change_room"){
        return {...state, roomNumber:action.payload}
    }
    else if(action.type === "change_name"){
        return {...state, name:action.payload}
    }
    else if(action.type === "change_email"){
        return {...state, email:action.payload}
    }
    else if(action.type === "change_pass"){
        return {...state, pass:action.payload}
    }
    else if(action.type === "change_phone"){
        return {...state, phone:action.payload}
    }
    else if(action.type === "change_role"){
        return {...state, role:action.payload}
    }
    else if(action.type === "change_filter_role"){
        return {...state, filterRole:action.payload}
    }
    else if(action.type === "change_filter_room"){
        return {...state, filterRoom:action.payload}
    }
    else if(action.type === "change_filter_floor"){
        return {...state, filterFloor:action.payload}
    }
    return state
}

export default reducer