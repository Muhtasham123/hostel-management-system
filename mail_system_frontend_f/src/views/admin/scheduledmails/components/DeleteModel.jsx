import React from 'react'
import axios from "axios"
import {toast} from "react-toastify"

const DeleteModel = ({ id, setDeleteModelOpen, setRefresh, refresh}) => {

    const handleDelete = async()=>{
        try {
            const res = await axios.delete(`http://localhost:4000/admin/schedueledEmails/deleteSchedueledEmails?id=${id}`,{withCredentials:true})

            toast.success(res.message)
        } catch (error) {
            if(error.response){
                toast.error(error.response.data.message)
            }else{
                toast.error("Failed to delete email")
            }
        }
    }
  return (
      <div className={`fixed h-[100vh] w-[100vw] inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50`}>
          <div className="bg-white p-6 rounded-lg w-[40%] h-[30%]">
             <h1 className="text-2xl font-bolder text-gray-700">Are you sure to delete this email?</h1>

              <div className="flex w-full justify-end gap-4 mt-4">
                  <button onClick = {()=>{
                    handleDelete()
                    setDeleteModelOpen(false)
                    setRefresh(refresh + 1)
                }}
                 className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Yes</button>

                  <button onClick={()=>setDeleteModelOpen(false)} className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Cancel</button>
              </div>
          </div>
      </div>
  )
}

export default DeleteModel