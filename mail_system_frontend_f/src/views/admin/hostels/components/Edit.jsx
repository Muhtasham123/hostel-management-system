import React from 'react'
import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import Form from "./form"
import axios from "axios"
import {toast} from "react-toastify"
import {BounceLoader} from "react-spinners"

const Edit = () => {
    const {id} = useParams()
    const [hostel, setHostel] = useState({})
    const [loading, setLoading] = useState(true)

    const fetchHostel = async()=>{
        try {
            setLoading(true)
            const res = await axios.get(`http://localhost:4000/admin/hostels/${id}`,{withCredentials:true})

            setHostel(res.data.data.hostels[0])
            setLoading(false)
        } catch (error) {
            setLoading(false)
            if(error.response){
                toast.error(error.response.data.message)
            }else{
                toast.error("Error fetching hostel data")
            }
        }
    }

    useEffect(()=>{
        fetchHostel()
    },[])
  return (
    !loading ?
    <Form reqType="put"
    data={hostel}
    editId={id}/>
    :
    <div className = "h-[100vh] w-full flex items-center justify-center">
        <BounceLoader color="#0b24c7" />
    </div>
  )
}

export default Edit