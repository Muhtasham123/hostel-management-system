import axios from "axios"
import {toast} from "react-toastify"

export const floorsHandler = async(type, dispatch, floorId, body)=>{
    try {
        let res = null
        if(type === "get"){
            res = await axios.get("http://localhost:4000/admin/floors/getFloor",{withCredentials:true})
            dispatch({type, payload:res.data.data})
        }
        else if(type === "add"){
            res = await axios.post("http://localhost:4000/admin/floors/addFloor",{number:body.number},{withCredentials:true})
            toast.success(res.data.message)
        }
        else if(type === "edit"){
            res = await axios.put(`http://localhost:4000/admin/floors/editFloor/${floorId}`,{number:body.number},{withCredentials:true})
            toast.success(res.data.message)

        }
        else if(type === "delete"){
            res = await axios.delete(`http://localhost:4000/admin/floors/deleteFloor/${floorId}`,{withCredentials:true})
            toast.success(res.data.message)
        }

        console.log(res.data.message)
    } catch (error) {
        if(error.response){
            console.log(error.response.data.message)
            toast.error(error.response.data.message)
        }else{
            console.log(error)
            toast.error("Failed to fetch floors")
        }
    }
}

