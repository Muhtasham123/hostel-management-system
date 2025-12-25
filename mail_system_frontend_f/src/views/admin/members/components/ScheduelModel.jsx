import React from 'react'
import {useState, useEffect, useContext} from "react"
import {toast} from "react-toastify"
import {Link} from "react-router-dom"
import { context } from 'context';

const ScheduelModel = ({dispatch, state, recipients}) => {
    const {hostelContext} = useContext(context)
    const [type, setType] = useState("monthly")
    const [typeValue, setTypeValue] = useState(1)

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    const dates = []
    for(let i = 1;i<=31;i++){
        dates.push(i)
    }

    useEffect(()=>{
        if(recipients.length === 0){
            dispatch({type:"close_scheduel_model"})
            toast.error("Select at least one member")
        }
    },[])

  return (
    <div className={`fixed h-[100vh] w-[100vw] inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50`}>
        <div className="bg-white p-6 rounded-lg w-[40%]">
          <lable>Select Schedule type</lable>
          <select value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full">
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
          </select>

          <lable>
            {type === "yearly" ? "Select month" : type === "monthly" ? "Select date" : "Select day"}
          </lable>

          <select value={typeValue}
              onChange={(e) => setTypeValue(e.target.value)}
              className="rounded-xl border bg-white/0 p-3 text-sm outline-none w-full">
              {
                type === "monthly" ?
                dates.map((d)=>{
                    return <option value={d}>{d}</option>
                })
                :

                type === "yearly" ?
                months.map((m) => {
                    return <option value={m}>{m}</option>
                })
                :

                days.map((d)=>{
                    return <option value={d}>{d}</option>
                })
              }
          </select>

          <div className="flex w-full justify-end gap-4 mt-4">
            <Link to={`/admin/mail/${hostelContext}/${recipients.join(",")}`}
            state = {{type, typeValue}} className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">OK</Link>

              <button onClick={() => {
                setType("monthly")
                dispatch({ type: "close_scheduel_model" })
              }} className="hover:bg-blue-700 p-2 rounded-md text-white bg-blueSecondary">Cancel</button>
          </div>
        </div>
    </div>
  )
}

export default ScheduelModel