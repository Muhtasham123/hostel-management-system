import React from 'react'
import { IoSendOutline } from "react-icons/io5";
import {useParams, useNavigate, useLocation} from "react-router-dom"
import {toast} from "react-toastify"
import {useEffect, useState} from "react"
import PasswordModel from './components/PasswordModel';
import { context } from 'context';
import {useContext} from "react"

const Mail = () => {
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")
    const [closeModel, setCloseModel] = useState(true)
    let {recipients, hostel_id} = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const {type, typeValue} = location.state || {type:null, typeValue:null}
    const {setHostelContext} = useContext(context)


    useEffect(()=>{
        //setHostelContext(hostel_id)
        if(!recipients){
            console.log("djskjdsk")
            toast.error("Select at least one memeber")
            navigate(`/admin/members/${hostel_id}`)
        }else {
            recipients = recipients.split(",")
            if(recipients.length === 0){
                toast.error("Select at least one memeber")
                navigate(`/admin/members/${hostel_id}`)
            }
        }
        console.log("recp")
    },[])
  return (
    <>
    
        {!closeModel 
        ?
        <PasswordModel setCloseModel={setCloseModel} subject={subject} body={body} recipients = {recipients} type={type} typeValue = {typeValue}/>
        :
        <></>
        }

    <div className = 'mt-10'>
        <div>
            <button 
            onClick = {()=>{
                if(!subject || !body){
                    toast.error("Enter subject and body")
                }else{
                    setCloseModel(false)
                }
            }} className="flex gap-2 justify-center items-center hover:bg-blue-700 p-3 rounded-md text-white bg-blueSecondary font-bold text-2xl">
              Send<IoSendOutline />
            </button>
        </div>

      <div
          className={`!z-5 mt-4 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none $`}
          
      >

        <form>
            <input value={subject} 
            onChange={(e)=>setSubject(e.target.value)}
            type = "text" placeholder="Subject" className = "w-full p-4 border-b-2 focus:outline-none"/>

            <textarea value = {body}
            onChange = {(e)=>setBody(e.target.value)}
            placeholder="Body" className= "w-full h-[100vh] p-4 focus:outline-none"></textarea>
        </form>
          
      </div>
    </div>
    </>
  );
}

export default Mail