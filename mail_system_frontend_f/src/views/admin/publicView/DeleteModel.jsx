import React from 'react'
import { context } from 'context'
import {useContext} from "react"
import axios from "axios"
import {toast } from "react-toastify"

const DeleteModel = ({ replyId, setReplyId, setDeleteModelOpen, setRefreshReviews, refreshReviews}) => {
  const {hostelContext} = useContext(context)

  const deleteReply = async()=>{
    try {
        console.log(replyId)
        const res = await axios.delete(`http://localhost:4000/admin/replies/${hostelContext}/${replyId}`,{withCredentials:true})
        setDeleteModelOpen(false)
        setRefreshReviews(refreshReviews+1)
        toast.success(res.data.message)
    } catch (error) {
        
        if(error.response){
            toast.error(error.response.data.message)
        }else{
            console.log(error)
            toast.error("Failed to delete reply")
        }
    }
  }

  return (
      <div className={`fixed h-[100vh] w-[100vw] inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50`}>
          <div className="bg-white p-6 rounded-lg w-[40%] h-[30%]">
             <h1 className="text-2xl font-bolder text-gray-700">Are you sure to delete this reply?</h1>

              <div className="flex w-full justify-end gap-4 mt-4">
                  <button onClick = {deleteReply} className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Yes</button>

                  <button onClick={()=>{
                    setDeleteModelOpen(false)
                    setReplyId("")
                  }} className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Cancel</button>
              </div>
          </div>
      </div>
  )
}

export default DeleteModel