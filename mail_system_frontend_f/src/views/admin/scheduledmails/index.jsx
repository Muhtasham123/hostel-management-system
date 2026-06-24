import React from 'react'
import {useState, useEffect} from "react"
import axios from "axios"
import {toast} from "react-toastify"
import ComplexTable from "./components/ComplexTable";
import { columnsDataComplex } from "./variables/columnsData";
import DeleteModel from './components/DeleteModel';
import { context } from 'context';
import { useContext } from 'react';
import {useParams} from "react-router-dom"

const ScheduledMails = () => {
    const {hostel_id} = useParams()
    const {setHostelContext} = useContext(context)
    const [mails, setMails] = useState([])
    const [deleteModelOpen, setDeleteModelOpen] = useState(false)
    const [deleteId, setDeleteId] = useState("")
    const [refresh, setRefresh] = useState(0)

    const fetchMails = async()=>{
        try {
            const res = await axios.get(`http://localhost:4000/admin/schedueledEmails/${hostel_id}/all`,{withCredentials:true})
            setMails(res.data.data)
        } catch (error) {
            if(error.respons){
                toast.error(error.response.data.message)
            }else{
                toast.error("Failed to fetch mails")
            }
        }
    }

    useEffect(()=>{
        setHostelContext(hostel_id)
        fetchMails()
    },[refresh, hostel_id])

  return (
    <>
    {deleteModelOpen
    ?
    <DeleteModel 
    id={deleteId} 
    setDeleteModelOpen={setDeleteModelOpen}
    setRefresh={setRefresh}
    refresh={refresh}
    />
    :
    <></>
    }

    <div className = "mt-5">
    
            {/* Complex Table , Task & Calendar */}
            
            <ComplexTable
              columnsData={columnsDataComplex}
              tableData={mails}
              setDeleteId = {setDeleteId}
              setDeleteModelOpen = {setDeleteModelOpen}
            />
    
    </div>
    </>
  )
}

export default ScheduledMails