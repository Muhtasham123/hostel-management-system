import React from 'react'
import { roomsHandler } from '../variables/handlers'

const DeleteModel = ({ roomId, dispatch}) => {
  return (
      <div className={`fixed h-[100vh] w-[100vw] inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50`}>
          <div className="bg-white p-6 rounded-lg w-[40%] h-[30%]">
             <h1 className="text-2xl font-bolder text-gray-700">Are you sure to delete this room?</h1>

              <div className="flex w-full justify-end gap-4 mt-4">
                  <button onClick = {async()=>{
                    await roomsHandler("delete", dispatch, roomId)
                    dispatch({ type: "delete" })
                    dispatch({type:"close_delete_model"})
                  }}className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Yes</button>

                  <button onClick={()=>dispatch({type:"close_delete_model"})} className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Cancel</button>
              </div>
          </div>
      </div>
  )
}

export default DeleteModel