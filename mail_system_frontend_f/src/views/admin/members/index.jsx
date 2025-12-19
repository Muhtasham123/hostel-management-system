import React from 'react'
import ComplexTable from "./components/ComplexTable";
import { columnsDataComplex } from "./variables/columnsData";
import reducer from "./variables/reducer"
import {useReducer, useEffect, useRef, useState} from "react"
import {membersHandler} from "./variables/handlers"
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import EditModel from "./components/EditModel"
import DeleteModel from "./components/DeleteModel"
import AddModel from "./components/AddModel"
import ScheduelModel from "./components/ScheduelModel"
import {Link} from "react-router-dom"

const Members = () => {
    const refs = useRef([])
    const [recipients, setRecipients] = useState([])
    const [state, dispatch] = useReducer(reducer, 
        {
            rooms:[],
            floors:[],
            members:[],
            roles:[],
            isModelOpen:false,
            isDeleteModelOpen:false,
            isAddModelOpen:false,
            isScheduelModelOpen:false,
            memberId:null,
            name:null,
            email:null,
            role: null,
            roomNumber:null,
            filterRole:"all",
            filterRoom:"all",
            filterFloor:"all",
            refreshMembers:0,
            select:false,
        })

    useEffect(()=>{
        membersHandler("get", dispatch,null, {})
        membersHandler("get_rooms", dispatch, null, {})
        membersHandler("get_floors", dispatch, null, {})
        membersHandler("get_roles", dispatch, null, {})
    },[state.refreshMembers])

  return (
    <>
    {state.isModelOpen ?
        <EditModel
        state={state}
        dispatch={dispatch}
        />
        :
        <></>
    }

    {state.isDeleteModelOpen ?
        <DeleteModel
            roomId={state.memberId}
            dispatch={dispatch}
        />
        :
        <></>
    }

    {state.isAddModelOpen ?
        <AddModel
            state={state}
            dispatch={dispatch}
        />
        :
        <></>
    }

    {state.isScheduelModelOpen ?
        <ScheduelModel
        dispatch = {dispatch}
        state = {state}
        recipients = {recipients}
        />
        :
        <></>
    }
      <div className = "mt-5">
          <div className= "flex gap-4 mb-3 w-full justify-between">
            {/* Add Button */}
            <div className = "flex gap-2">
                <button onClick={()=>{
                dispatch({type:"open_add_model"})
                }} className="flex gap-2 justify-center items-center hover:bg-blue-700 p-3 rounded-md text-white bg-blueSecondary font-bold text-2xl">
                Add Member<IoIosAddCircleOutline />

                </button>

                <Link to = {`/admin/mail/${recipients.join(",")}`} className="flex gap-2 justify-center items-center hover:bg-blue-700 p-3 rounded-md text-white bg-blueSecondary font-bold text-2xl">
                    New Mail<FaRegEdit />
                </Link>

                <button onClick={() => {
                dispatch({ type: "open_scheduel_model" })
                }} className="flex gap-2 justify-center items-center hover:bg-blue-700 p-3 rounded-md text-white bg-blueSecondary font-bold text-2xl">
                Schedule Mail<SlCalender />
                </button>
            </div>

            {/*Filter options*/}
            <div className = "flex gap-4">
                <div>
                    <p>Filter by role</p>
                    <select value={state.filterRole} className="rounded-md p-3 outline-1"
                    onChange = {(e)=>{
                        dispatch({type:"change_filter_role", payload:e.target.value})
                        dispatch({ type: "change_filter_room", payload: "all" })
                        dispatch({ type: "change_filter_floor", payload: "all" })
                        membersHandler("filter", dispatch, null, {}, "role", e.target.value)
                    }}>
                        <option value="all">all</option>
                        {

                            state.roles.map((r)=>{
                                return <option key = {r.id} value={r.role}>{r.role}</option>
                            })
                        }
                    </select>
                </div>

                 <div>
                     <p>Filter by room</p>
                     <select value={state.filterRoom} className="rounded-md p-3 outline-1 min-w-full"
                    onChange={(e) => {
                        dispatch({ type: "change_filter_role", payload: "all" })
                        dispatch({ type: "change_filter_room", payload: e.target.value })
                        dispatch({ type: "change_filter_floor", payload: "all" })
                        membersHandler("filter", dispatch, null, {}, "room", e.target.value)
                    }}>
                         <option value="all">all</option>
                         {
                             state.rooms.map((r) => {
                                 return <option key={r.id} value={r.number}>{r.number}</option>
                             })
                         }
                     </select>
                 </div>

                <div>
                    <p>Filter by floor</p>
                    <select value={state.filterFloor} className="rounded-md p-3 outline-1 min-w-full"
                    onChange={(e) => {
                        dispatch({ type: "change_filter_role", payload: "all" })
                        dispatch({ type: "change_filter_room", payload: "all" })
                        dispatch({ type: "change_filter_floor", payload: e.target.value })
                        membersHandler("filter", dispatch, null, {}, "floor", e.target.value)
                    }}>
                        <option value="all">all</option>
                        {
                            state.floors.map((f) => {
                                return <option key={f.id} value={f.number}>{f.number}</option>
                            })
                        }
                    </select>
                </div>
            </div>
        </div>

        <div className="rounded-md p-3 outline-1 flex items-center">
            <input onChange = {(e)=>{
                const check = e.target.checked
                refs.current.forEach((cb)=>cb.checked = check)
                if(check){
                    const newRecipients = state.members.map((m)=>m.id)
                    setRecipients(newRecipients)
                    console.log(recipients)
                }else{
                    setRecipients([])
                    console.log(recipients)
                }
            }} 
            className="defaultCheckbox h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center 
            rounded-md border border-gray-300 text-white/0 outline-none transition duration-[0.2s]
            checked:text-white hover:cursor-pointer dark:border-white/10
            checked:border-none checked:bg-purple-500 dark:checked:bg-purple-400 mr-2" type="checkbox"/>Select All
        </div>

        {/* Complex Table , Task & Calendar */}
        
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={state.members}
          dispatch={dispatch}
          checkRefs={refs}
          state={state}
          recipients = {recipients}
          setRecipients = {setRecipients}
        />

      </div>
    </>
  )
}

export default Members