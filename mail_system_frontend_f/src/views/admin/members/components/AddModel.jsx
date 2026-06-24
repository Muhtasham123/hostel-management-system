import React from 'react'
import { membersHandler } from '../variables/handlers'
import { context } from 'context'
import { useContext } from 'react'

const AddModel = ({state, dispatch}) => {
    const {hostelContext} = useContext(context)

  return (
      <div className={`fixed h-[100vh] w-[100vw] inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50`}>
          <form onSubmit = {async(e)=>{
              e.preventDefault()
              
              let roomId = null
              if(state.role === "resident" && state.roomNumber){
                const room = state.rooms.filter((r)=>Number(r.number) === Number(state.roomNumber))
                
                if(room.length){
                    roomId = room[0].id
                }
              }

              await membersHandler("add", dispatch, null, 
                { name: state.name, 
                  email: state.email,
                  phone_no: state.phone,
                  role: state.role,
                  room_no: state.roomNumber,
                  appPassword:state.pass
                },null, null, hostelContext, roomId)

              dispatch({ type: "add" })
              dispatch({ type: "close_add_model" })
              dispatch({type: "reset"})
          }} className="bg-white p-6 rounded-lg w-[40%]">

              <lable>Gmail app password</lable>
              <input value={state.pass}
                  onChange={(e) => dispatch({ type: "change_pass", payload: e.target.value })}
                  type="password"
                  placeholder='Enter your gmail app password'
                  className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full" />

             <lable>Member Name</lable>
              <input value={state.name}
                  onChange={(e) => dispatch({type:"change_name", payload:e.target.value})}
                  type="text"
                  placeholder='Enter member name'
                  className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full" />

              <lable>Email</lable>
              <input value={state.email}
                  onChange={(e) => dispatch({ type: "change_email", payload: e.target.value })}
                  type="email"
                  placeholder='Enter email of member'
                  className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full" />
            
              <lable>Phone no</lable>
              <input value={state.phone}
                  onChange={(e) => dispatch({ type: "change_phone", payload: e.target.value })}
                  type="text"
                  placeholder='Enter phone number of member'
                  className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full" />

              <lable>Select role</lable>
              <select value={state.role}
                  onChange={(e) => dispatch({ type: "change_role", payload: e.target.value })}
                  className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full">
                    {
                       state.roles.map((r)=>{
                        return <option key = {r.id} value={r.role}>{r.role}</option>
                    })
                    }
              </select>

              {
                state.role === "resident"
                ?
                <>

                    <lable>Select room</lable>
                    <select value={state.roomNumber}
                        onChange={(e) => dispatch({ type: "change_room", payload: e.target.value })}
                        className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full">
                        {
                            state.rooms.map((r) => {
                                if(r.status === "Available"){
                                    return <option key={r.id} value={r.number}>{r.number}</option>
                                }
                                return <></>
                            })
                        }
                    </select>
                </>
                :
                <></>
              }

              <div className="flex w-full justify-end gap-4 mt-4">
                  <button type = "submit" className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Add</button>

                  <button onClick={()=>dispatch({type:"close_add_model"})} className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Cancel</button>
              </div>
          </form>
      </div>
  )
}

export default AddModel