import axios from "axios"
import {toast} from "react-toastify"

const authHandler = async (e, url, user, navigate, dispatch)=>{
        e.preventDefault()
        try {
            dispatch("loading")
            const res = await axios.post(url, user,{withCredentials:true})
            console.log(res.data.message)
            dispatch("loading_done")
            navigate("/admin/hostels")

        } catch (error) {
            dispatch("loading_done")
            if(error.response){
                console.log(error.response.data.message)
                toast.error(error.response.data.message)
            }else{
                console.log(error)
                toast.error("Failed to Sign up")
            }
        }
}

export default authHandler