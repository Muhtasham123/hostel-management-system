import axios from "axios"
import {toast} from "react-toastify"

export const roomsHandler = async(type, dispatch, roomId, body, floor_id, hostel_id)=>{
    try {
        let res = null
        if(type === "get"){
            res = await axios.get(`http://localhost:4000/admin/rooms/${hostel_id}`,{withCredentials:true})
            dispatch({type, payload:res.data.data})
        }
        else if(type === "get_floors"){
            res = await axios.get(`http://localhost:4000/admin/floors/${hostel_id}`,{withCredentials:true})
            dispatch({type, payload:res.data.data})
        }
        else if(type === "add"){
            res = await axios.post(`http://localhost:4000/admin/rooms/${hostel_id}/${floor_id}`,body,{withCredentials:true})
            toast.success(res.data.message)
        }
        else if(type === "edit"){
            res = await axios.put(`http://localhost:4000/admin/rooms/${hostel_id}/${floor_id}/${roomId}`,body,{withCredentials:true})
            toast.success(res.data.message)
        }
        else if(type === "delete"){
            res = await axios.delete(`http://localhost:4000/admin/rooms/${hostel_id}/${floor_id}/${roomId}`,{withCredentials:true})
            toast.success(res.data.message)
        }

        console.log(res.data.message)
    } catch (error) {
        if(error.response){
            console.log(error.response.data.message)
            toast.error(error.response.data.message)
        }else{
            console.log(error)
            toast.error("Failed to fetch rooms")
        }
    }
}