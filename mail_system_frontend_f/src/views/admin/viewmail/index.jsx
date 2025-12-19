import React from 'react'
import {useParams} from "react-router-dom"
import {useState, useEffect} from "react"
import axios from "axios"
import {toast} from "react-toastify"
import ComplexTable from "./components/ComplexTable";
import { columnsDataComplex } from "./variables/columnsData";

const ViewMail = () => {
  const {id} = useParams()
  const [email, setEmail] = useState({})
  const [recipients, setRecipients] = useState([])

  const fetchMail = async()=>{
    try {
      const res = await axios.get(`http://localhost:4000/admin/emails/getEmails?id=${id}`,{withCredentials:true})

      const emailObj = res.data.data
      const names = emailObj.recipient_name.split(",")
      const emails = emailObj.recipient_email.split(",")
      const ids = emailObj.recipient_id.split(",")
      const roles = emailObj.recipient_role.split(",")

      const recps = []
      for(let i = 0; i<ids.length; i++){
        const newRecp = {
          id:ids[i],
          name:names[i],
          email:emails[i],
          role:roles[i]
        }
        recps.push(newRecp)
      }

      setEmail(emailObj)
      setRecipients(recps)

    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message)
      }else{
        toast.error("Failed to fetch email")
      }
    }
  }

  useEffect(()=>{
    fetchMail()
  },[])

  return (
    <>
    <div
      className={`!z-5 mt-4 relative flex flex-col bg-white mb-4 bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none $`}

    >
      <div>
        <h1 className = "text-2xl font-bold border-b-2 p-4 text-gray-800">{email.subject}</h1>
        <p className= "text-gray-800 p-4 whitespace-pre-wrap">{email.body}</p>
      </div>
    </div>

    <ComplexTable
      columnsData={columnsDataComplex}
      tableData={recipients}
    />
    </>
  )
}

export default ViewMail