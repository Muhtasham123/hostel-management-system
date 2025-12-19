import React from 'react'
import ComplexTable from "./components/ComplexTable";
import { columnsDataComplex } from "./variables/columnsData";
import reducer from "./variables/reducer"
import {useReducer, useEffect, useState} from "react"
import {roomsHandler} from "./variables/handlers"
import { IoIosAddCircleOutline } from "react-icons/io";
import EditModel from "./components/EditModel"
import DeleteModel from "./components/DeleteModel"
import AddModel from "./components/AddModel"

const Rooms = () => {
    const [state, dispatch] = useReducer(reducer, 
        {
            rooms:[],
            floors:[],
            selectedFloor:null, 
            isModelOpen:false,
            isDeleteModelOpen:false,
            isAddModelOpen:false,
            roomNumber:null,
            seats:null,
            roomsId:null,
            refreshRooms:0
        })

    useEffect(()=>{
        roomsHandler("get", dispatch, null, {})
        roomsHandler("get_floors", dispatch, null, {})
    },[state.refreshRooms])

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
            roomId={state.roomId}
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
      <div className = "mt-5">
          <div className= "flex gap-4 mb-3">
            {/* Add Button */}
            <button onClick={()=>{
            dispatch({type:"open_add_model"})
            }} className="flex gap-2 justify-center items-center hover:bg-blue-700 p-3 rounded-md text-white bg-blueSecondary font-bold text-2xl">
            Add Room<IoIosAddCircleOutline />

            </button>
        </div>

        {/* Complex Table , Task & Calendar */}
        
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={state.rooms}
          dispatch={dispatch}
        />

      </div>
    </>
  )
}

export default Rooms