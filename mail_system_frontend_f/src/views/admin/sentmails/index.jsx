import React from 'react'
import {useState, useEffect} from "react"
import axios from "axios"
import {toast} from "react-toastify"
import {Link, useParams} from "react-router-dom"
import { context } from 'context'
import { useContext } from 'react'

const SentMails = () => {
    const {hostel_id} = useParams()
    const {setHostelContext} = useContext(context)

    const [mails, setMails] = useState([])

    const fetchMails = async()=>{
        try {
            const res = await axios.get(`http://localhost:4000/admin/emails/${hostel_id}/all`,{withCredentials:true})
            setMails(res.data.data)
        } catch (error) {
            if(error.response){
                toast.error(error.response.data.message)
            }else{
                toast.error("Failed to fetch emails")
            }
        }
    }

    useEffect(()=>{
        setHostelContext(hostel_id)
        fetchMails()
    },[])

  return (
    <div
          className={`!z-5 mt-4 relative flex flex-col bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none $`}
          
      >
        {
            mails.map((m)=>{
                const date = new Date(m.sent_at)
                const month = date.toLocaleString("en-US", { month: "long" })
                const day = date.getDate()
                const year = date.getFullYear()
                const hours = date.getHours()
                const minutes = date.getMinutes()

                return <Link to = {`/admin/viewMail/${hostel_id}/${m.id}`} className = "p-4 border-b-2 transition-all hover:bg-gray-100">
                    <div className="flex justify-between">
                        <h3 className= "font-bold text-large truncate overflow-hidden whitespace-nowrap text-ellipsis">{m.subject}</h3>

                        <p className= "text-gray-500">{
                             month+"/"+day+"/"+year+"---"+hours+":"+minutes
                        }</p>
                    </div>
                    <p className= "truncate overflow-hidden whitespace-nowrap text-ellipsis text-gray-800">{m.body}</p>
                </Link>
            })
        }
      </div>
  )
}

export default SentMails