import React from 'react'
import ComplexTable from "views/admin/floors/components/ComplexTable";
import { columnsDataComplex } from "./variables/columnsData";
import reducer from "./variables/reducer"
import {useReducer, useEffect, useState} from "react"
import {floorsHandler} from "./variables/handlers"
import { IoIosAddCircleOutline } from "react-icons/io";
import EditModel from "./components/EditModel"
import DeleteModel from "./components/DeleteModel"

const Floors = () => {
    const [state, dispatch] = useReducer(reducer, 
        {
            floors:[], 
            isModelOpen:false,
            isDeleteModelOpen:false,
            floorId:null,
            editFloorNumber:null,
            refreshFloors:0
        })
    const [floorNumber, setFloorNumber] = useState(null)

    useEffect(()=>{
        floorsHandler("get", dispatch, null, {})
    },[state.refreshFloors])

  return (
    <>
    {state.isModelOpen ?
        <EditModel
        floorNumber={state.editFloorNumber}
        floorId={state.floorId}
        dispatch={dispatch}
        />
        :
        <></>
    }

    {state.isDeleteModelOpen ?
        <DeleteModel
            floorId={state.floorId}
            dispatch={dispatch}
        />
        :
        <></>
    }
      <div className = "mt-5">
          <div className= "flex gap-4 mb-3">
            <input value={floorNumber}
             onChange={(e)=>setFloorNumber(e.target.value)}
             type="number" 
             placeholder='Enter floor number' 
             className="rounded-xl border bg-white/0 p-3 text-sm outline-none"/>

            {/* Add Button */}
            <button onClick={()=>{
            floorsHandler("add", null, null, {number:floorNumber})
            dispatch({type:"add"})
            }} className="flex gap-2 justify-center items-center hover:bg-blue-700 p-3 rounded-md text-white bg-blueSecondary font-bold text-2xl">
            Add Floor<IoIosAddCircleOutline />

            </button>
        </div>

        {/* Complex Table , Task & Calendar */}
        
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={state.floors}
          dispatch={dispatch}
        />

      </div>
    </>
  )
}

export default Floors