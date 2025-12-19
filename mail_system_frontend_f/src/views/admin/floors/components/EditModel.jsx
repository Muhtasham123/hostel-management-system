import React from 'react'
import { floorsHandler } from '../variables/handlers'

const EditModel = ({floorNumber, floorId, dispatch}) => {
  return (
      <div className={`fixed h-[100vh] w-[100vw] inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50`}>
          <div className="bg-white p-6 rounded-lg w-[40%] h-[30%]">
             <lable>Floor Number</lable>
              <input value={floorNumber}
                  onChange={(e) => dispatch({type:"change_edit_floor", payload:e.target.value})}
                  type="number"
                  placeholder='Enter floor number'
                  className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full" />

              <div className="flex w-full justify-end gap-4 mt-4">
                  <button onClick = {async()=>{
                    await floorsHandler("edit", dispatch, floorId, {number:floorNumber})
                    dispatch({ type: "edit" })
                    dispatch({type:"close_model"})
                  }}className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Edit</button>

                  <button onClick={()=>dispatch({type:"close_model"})} className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Cancel</button>
              </div>
          </div>
      </div>
  )
}

export default EditModel