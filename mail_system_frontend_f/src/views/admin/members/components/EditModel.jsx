import React from 'react'
import { membersHandler } from '../variables/handlers'

const EditModel = ({state, dispatch}) => {
  return (
      <div className={`fixed h-[100vh] w-[100vw] inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50`}>
          <form onSubmit={async (e) => {
              e.preventDefault()
              await membersHandler("edit", null, state.memberId, 
                  {
                      name: state.name,
                      email: state.email,
                      role: state.role,
                      room_no: state.roomNumber
                  }
              )
              dispatch({ type: "close_model" })
              dispatch({ type: "edit" })
          }} className="bg-white p-6 rounded-lg w-[40%]">
              <lable>Member Name</lable>
              <input value={state.name}
                  onChange={(e) => dispatch({ type: "change_name", payload: e.target.value })}
                  type="text"
                  placeholder='Enter member name'
                  className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full" />

              <lable>Email</lable>
              <input value={state.email}
                  onChange={(e) => dispatch({ type: "change_email", payload: e.target.value })}
                  type="email"
                  placeholder='Enter email of member'
                  className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full" />

              <lable>Select role</lable>
              <select value={state.role}
                  onChange={(e) => dispatch({ type: "change_role", payload: e.target.value })}
                  className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full">
                  {
                      state.roles.map((r) => {
                          return <option key={r.id} value={r.role}>{r.role}</option>
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
                                      return <option key={r.id} value={r.number}>{r.number}</option>
                                  })
                              }
                          </select>
                      </>
                      :
                      <></>
              }

              <div className="flex w-full justify-end gap-4 mt-4">
                  <button type="submit" className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">EDIT</button>

                  <button onClick={() => dispatch({ type: "close_model" })} className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Cancel</button>
              </div>
        </form>
    </div>
  )
}

export default EditModel