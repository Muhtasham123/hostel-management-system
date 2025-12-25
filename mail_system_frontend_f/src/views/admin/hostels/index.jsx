import {useEffect, useReducer} from "react"
import reducer from "./variables/reducer"
import { hostelHandler } from "./variables/handlers"
import {Link} from "react-router-dom"
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdOutlineOpenInNew } from "react-icons/md";

const Hostels = () => {
    const [state, dispatch] = useReducer(reducer, 
        {
            hostels:[]
        }
    )

    useEffect(()=>{
        hostelHandler("get", dispatch)
    },[])

  return (
    state.hostels.length === 0
    ?
    <div className="h-[100vh] w-full flex items-center justify-center">
        <div>
            <h1 className="text-2xl mb-4 font-bold text-gray-800">You do not have any hostels</h1>
        
            <Link className="p-4 rounded-lg flex gap-2 text-lg font-bold items-center justify-center text-blueSecondary outline-2 outline-blueSecondary bg-blue-200 hover:bg-blue-300" to="/admin/hostel/add">Add Hostels <IoIosAddCircleOutline /></Link>
        </div>
    </div>
    :
    <>
    <Link className="flex w-[30%] gap-2 justify-center mt-10 items-center hover:bg-blue-700 p-3 rounded-md text-white bg-blueSecondary font-bold text-2xl" to="/admin/hostel/add">Add Hostels <IoIosAddCircleOutline /></Link>

    <div className = "w-full mt-10 grid grid-cols-2">
        {
        state.hostels.map((h)=>{
            return <div
                className={`!z-5 relative p-4 flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none`}

            >
                <div className = "w-full h-[200px]">
                    <img className = "w-full h-full object-cover" src={h.photo} alt="photo"/>
                </div>
                <div>
                    <h1 className = "text-2xl mt-4 font-bold text-gray-700">{h.name.toUpperCase()}</h1>
                </div>

                <div className="flex items-center gap-2 text-gray-700 m-2 pl-4 truncate overflow-hidden whitespace-nowrap text-ellipsis"><IoLocationSharp className = "text-red-500 text-2xl"/>{h.location}</div>

                <div className="flex items-center gap-2 text-gray-700 pl-4 m-2"><FaPhone className="text-blue-500 text-2xl" />{h.contact}</div>

                <div className = "flex justify-end gap-4 w-full mt-5">
                    <button className="p-2 rounded-md bg-red-500 text-white text-2xl hover:bg-red-700"><MdDelete /></button>

                    <Link to="/admin/hostel/edit" className="p-2 rounded-md bg-yellow-500 text-white text-2xl hover:bg-yellow-700"><FaEdit /></Link>

                    <Link to={`/admin/default/${h.id}`} className="p-2 rounded-md bg-green-500 text-white text-2xl hover:bg-green-700"><MdOutlineOpenInNew /></Link>
                </div>
            </div>
        })
       
        }
    </div>
    </>
  )
}

export default Hostels