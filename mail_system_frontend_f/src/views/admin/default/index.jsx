import {useState, useEffect} from "react"
import MiniCalendar from "components/calendar/MiniCalendar";
import PieChartCard from "views/admin/default/components/PieChartCard";
import {context} from "../../../context/index"
import { useContext } from "react";
import {useParams} from "react-router-dom"

import { FaBed } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { FaRegBuilding, FaDoorOpen } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import Widget from "components/widget/Widget";
import Map from "components/map/index";

import axios from "axios"
import {toast} from "react-toastify"

import {BounceLoader} from "react-spinners"

const Dashboard = () => {
  const [data,setData] = useState({})
  const [loading, setLoading] = useState(true)
  const {hostel_id} = useParams()
  const {hostelContext, setHostelContext} = useContext(context)


  const fetchData = async()=>{
    try{
      setLoading(true)
      const res = await axios.get(`http://localhost:4000/admin/dashboard/${hostel_id}`,{withCredentials:true})
      
      setData(res.data.data)
      setLoading(false)
    }catch(error){
      if(error.response){
        toast.error(error.response.data.message)
      }else{
        toast.error("Failed to fetch data")
      }
      setLoading(false)
    }
  }

  useEffect(()=>{
    setHostelContext(hostel_id)
    fetchData()
  },[])

  return (
    !loading
    ?
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<FaRegBuilding className="h-7 w-7" />}
          title={"Floors"}
          subtitle={data.floors}
        />
        <Widget
          icon={<FaDoorOpen className="h-6 w-6" />}
          title={"Rooms"}
          subtitle={data.rooms}
        />
        <Widget
          icon={<FaUsersLine className="h-7 w-7" />}
          title={"Residents"}
          subtitle={data.residents}
        />
        <Widget
          icon={<IoMdSend className="h-6 w-6" />}
          title={"Sent Mails"}
          subtitle={data.sent}
        />
        <Widget
          icon={<SlCalender className="h-7 w-7" />}
          title={"Scheduled Mails"}
          subtitle={data.scheduled}
        />
        <Widget
          icon={<FaBed className="h-7 w-7" />}
          title={"Available seats"}
          subtitle={data.seats}
        />
      </div>

      <div className="w-full mt-10">
        <Map 
        latitude = {Number.parseFloat(data.latitude)} 
        longitude = {Number.parseFloat(data.longitude)}/>
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <MiniCalendar />
        <PieChartCard series={[data.filled ?? 0, data.vaccant ?? 0]} />
      </div>

    </div>
    :
    <div className = "h-[100vh] w-full flex items-center justify-center">
        <BounceLoader color="#0b24c7" />
    </div>
  );
};

export default Dashboard;
