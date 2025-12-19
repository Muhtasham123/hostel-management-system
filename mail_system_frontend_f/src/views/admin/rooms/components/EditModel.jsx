import React from 'react'
import { roomsHandler } from '../variables/handlers'

const EditModel = ({state, dispatch}) => {
  return (
      <div className={`fixed h-[100vh] w-[100vw] inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50`}>
          <form onSubmit={async (e) => {
              e.preventDefault()
              await roomsHandler("edit", null, state.roomId, { number: state.roomNumber, seats: state.seats, floorNo: state.selectedFloor })
              dispatch({ type: "close_model" })
              dispatch({ type: "edit" })
              dispatch({ type: "change_room_number", payload: null })
              dispatch({ type: "change_seats", payload: null })
              dispatch({ type: "change_floor", payload: null })
          }} className="bg-white p-6 rounded-lg w-[40%]">
            <lable>Room Number</lable>
             <input value={state.roomNumber}
                 onChange={(e) => dispatch({type:"change_room_number", payload:e.target.value})}
                 type="number"
                 placeholder='Enter room number'
                 className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full" />
             <lable>Seats</lable>
             <input value={state.seats}
                 onChange={(e) => dispatch({ type: "change_seats", payload: e.target.value })}
                 type="number"
                 placeholder='Enter number of seats'
                 className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full" />
             <lable>Select floor</lable>
             <select value={state.selectedFloor}
                 onChange={(e) => dispatch({ type: "change_floor", payload: e.target.value })}
                 className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full">
                   {
                      state.floors.map((f)=>{
                       return <option key = {f.id} value={f.number}>{f.number}</option>
                   })
                   }
             </select>
             <div className="flex w-full justify-end gap-4 mt-4">
                 <button type = "submit" className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Edit</button>

                 <button onClick={()=>dispatch({type:"close_model"})} className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Cancel</button>
             </div>
        </form>
    </div>
  )
}

export default EditModel