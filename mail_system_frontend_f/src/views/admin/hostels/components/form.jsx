import {useState} from "react"
import {useParams, useNavigate} from "react-router-dom"
import axios from "axios"
import {toast} from "react-toastify"

const Form = ({reqType, data}) => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [name, setName] = useState(data ? data.name : "")
    const [location, setLocation] = useState(data ? data.location : "")
    const [description, setDescription] = useState(data ? data.description : "")
    const [services, setServices] = useState(data ? data.services : [])
    const [service, setService] = useState("")
    const [photo, setPhoto] = useState(null)
    const [type, setType] = useState(data ? data.type : "")

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("location", location)
            formData.append("photo", photo)
            formData.append("type", type)
            formData.append("services", JSON.stringify(services))
            formData.append("description", description)

            let res
            if(reqType === "post"){
                console.log(reqType)
                res = await axios.post("http://localhost:4000/admin/hostels",formData, {withCredentials:true})
            }else{
                res = await axios.put(`http://localhost:4000/admin/hostels/${id}`, formData, {withCredentials:true})
            }
            toast.success(res.data.message)
            navigate("/admin/hostels")
        } catch (error) {
            if(error.response){
                toast.error(error.response.data.message)
            }else{
                toast.error("Failed to add hostel")
            }
        }
    }

  return (
      <div
          className={`!z-5 relative flex mt-10 p-8 rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none $`}>
          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={(e)=>handleSubmit(e)}>
            <div className = "flex flex-col gap-2">
                <label>Enter hostel name</label>
                <input className = "p-4 rounded-md border border-gray-700" placeholder="Hostel name"
                value = {name}
                onChange = {(e)=>setName(e.target.value)}/>
            </div>

            <div className="flex flex-col gap-2">
                <label>Enter hostel location</label>
                  <input className="p-4 rounded-md border border-gray-700" placeholder="Lahore,Johar town" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}/>
            </div>

            <div className="flex flex-col gap-2">
                <label>Select hostel type</label>
                <select className="p-4 rounded-md border border-gray-700" 
                value={type}
                onChange={(e) => setType(e.target.value)}>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="mixed">Mixed</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label>Upload Photo</label>
                <input type="file" className="p-4 rounded-md border border-gray-700"
                onChange={(e) => setPhoto(e.target.files[0])}/>
            </div>

            <div className="flex flex-col gap-2 col-span-2">
                <label>Services</label>
                <input className="p-4 rounded-md border border-gray-700" placeholder="Enter service"
                value={service}
                onChange={(e) => setService(e.target.value)}/>

                <div>
                    <button type = "button" className = "p-2 rounded-md bg-blueSecondary text-white hover:bg-blue-500"
                    onClick = {()=>{
                        const id = Date.now()
                        const newService = {
                            id,
                            service
                        }
                        setServices([newService,...services])
                        setService("")
                    }}>Add service</button>
                </div>

                {
                    services.map((s,index)=>{
                        return <div key = {index} className = "flex p-4 bg-gray-100 rounded-md justify-between">
                            <p>{s.service}</p>
                            <button type = "button" className="p-2 rounded-md bg-blueSecondary text-white hover:bg-blue-500"
                            onClick = {()=>{
                                const newServices = services.filter((se)=>s.id !== se.id)
                                setServices(newServices)
                            }}>delete</button>
                        </div>
                    })
                }


            </div>

            <div className="flex flex-col gap-2 col-span-2">
                <label>Description</label>
                <textarea type="file" className="p-4 rounded-md border w-full border-gray-700" placeholder="Enter all rent related and other information here" rows="10"
                value = {description}
                onChange = {(e)=>setDescription(e.target.value)}/>
            </div>

            <button type = "submit" className = "rounded-md p-4 bg-blueSecondary text-white hover:bg-blue-400 col-span-2">Submit</button>

          </form>
      </div>
  )
}

export default Form