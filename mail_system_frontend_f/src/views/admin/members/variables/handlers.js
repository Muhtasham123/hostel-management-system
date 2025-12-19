import axios from "axios"
import {toast} from "react-toastify"

export const membersHandler = async(type, dispatch, memberId, body, filter, filterValue)=>{
    try {
        let res = null
        if(type === "get"){
            res = await axios.get("http://localhost:4000/admin/members/getMembers",{withCredentials:true})
            dispatch({type, payload:res.data.data})
        }
        else if(type === "filter"){
            res = await axios.get(`http://localhost:4000/admin/members/getMembers?${filter}=${filterValue}`,{withCredentials:true})
            dispatch({type:"get", payload:res.data.data})
        }
        else if(type === "get_rooms"){
            res = await axios.get("http://localhost:4000/admin/rooms/getRoom",{withCredentials:true})
            dispatch({type, payload:res.data.data})
        }
        else if(type === "get_floors"){
            res = await axios.get("http://localhost:4000/admin/floors/getFloor",{withCredentials:true})
            dispatch({type, payload:res.data.data})
        }
        else if(type === "get_roles"){
            res = await axios.get("http://localhost:4000/admin/roles/getRole",{withCredentials:true})
            dispatch({type, payload:res.data.data})
        }
        else if(type === "add"){
            res = await axios.post("http://localhost:4000/admin/members/addMember",body,{withCredentials:true})
            toast.success(res.data.message)
        }
        else if(type === "edit"){
            res = await axios.put(`http://localhost:4000/admin/members/editMember/${memberId}`,body,{withCredentials:true})
            toast.success(res.data.message)
        }
        else if(type === "delete"){
            res = await axios.delete(`http://localhost:4000/admin/members/deleteMember/${memberId}`,{withCredentials:true})
            toast.success(res.data.message)
        }

        console.log(res.data.message)
    } catch (error) {
        if(error.response){
            console.log(error.response.data.message)
            toast.error(error.response.data.message)
        }else{
            console.log(error)
            toast.error("Failed to fetch members")
        }
    }
}