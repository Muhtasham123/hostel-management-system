import axios from "axios"
import {toast} from "react-toastify"

export const hostelHandler = async(type, dispatch)=>{
    try {
        if(type === "get"){
            const res = await axios.get("http://localhost:4000/admin/hostels/all", {withCredentials:true})
            dispatch({type, payload:res.data.data})
        }
        console.log("fetched")
    } catch (error) {
        console.log(error)
      if(error.response){
        toast.error(error.response.data.message)
      }else{
        toast.error("Failed to fetch hostels")
      }  
    }
}
