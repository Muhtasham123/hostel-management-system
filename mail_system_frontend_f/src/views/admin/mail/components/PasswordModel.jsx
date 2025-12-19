import React from 'react'
import {useState} from "react"
import axios from "axios"
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom'

const PasswordModel = ({setCloseModel, subject, body, recipients, type, typeValue}) => {
    const [pass, setPass] = useState("")
    const navigate = useNavigate()

    const handelSubmit = async(e)=>{
        e.preventDefault()
        let emailObject = null

        if(!type && !typeValue){
            emailObject = {
                subject,
                body,
                recipients,
                appPassword:pass
            }
        }else{
            emailObject = {
                subject,
                body,
                recipients,
                appPassword: pass,
                type,
                scheduelingTime:typeValue
            }
        }

        try {
            if(!type && !typeValue){
                const res = await axios.post("http://localhost:4000/admin/emails/sendEmail",emailObject,{withCredentials:true})
                toast.success(res.data.message)
                navigate("/admin/sent")
            }else{
                const res = await axios.post("http://localhost:4000/admin/SchedueledEmails/scheduelEmail", emailObject, { withCredentials: true })
                toast.success(res.data.message)
                navigate("/admin/scheduled-mails")
            }
        } catch (error) {
            if(error.response){
                toast.error(error.response.data.message)
            }else{
                toast.error("Failed to send email")
            }
        }
    }

  return (
    <div className={`fixed h-[100vh] w-[100vw] inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50`}>

          <form onSubmit = {(e)=>handelSubmit(e)} 
          className="bg-white p-6 rounded-lg w-[40%]">
             <lable>Enter Gmail app password</lable>
              <input value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  type="password"
                  placeholder='Enter password'
                  className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full" />

              <div className="flex w-full justify-end gap-4 mt-4">
                  <button type = "submit" className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">OK</button>

                  <button onClick={()=>setCloseModel(true)} className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Cancel</button>
              </div>
          </form>

      </div>
  )
}

export default PasswordModel