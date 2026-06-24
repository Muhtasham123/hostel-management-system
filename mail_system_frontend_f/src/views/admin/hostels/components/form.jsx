import {useState} from "react"
import {useParams, useNavigate} from "react-router-dom"
import axios from "axios"
import {toast} from "react-toastify"
import FileUpload from "components/FileUpload"

const Form = ({reqType, data, editId}) => {
    console.log(data)
    const {id} = useParams()
    const navigate = useNavigate()
    const [name, setName] = useState(data ? data.name : "")
    const [location, setLocation] = useState(data ? data.location : "")
    const [phone, setPhone] = useState(data ? data.contact : "")
    const [latitude, setLatitude] = useState(data ? data.latitude : "")
    const [longitude, setLongitude] = useState(data ? data.longitude : "")
    const [description, setDescription] = useState(data ? data.description : "")
    const [services, setServices] = useState(data && data.serv ? data.serv.split(",") : [])
    const [service, setService] = useState("")
    const [photo, setPhoto] = useState(null)
    const [images, setImages] = useState([])
    const [type, setType] = useState(data ? data.type : "")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("name", name)
            formData.append("location", location)

            if(photo){
                formData.append("photo", photo.file)
            }

            if(images.length > 0){
                images.forEach((img)=>{
                    formData.append("images", img.file)
                })
            }
            
            formData.append("type", type)
            formData.append("services", JSON.stringify(services))
            formData.append("description", description)
            formData.append("phone",phone)
            formData.append("latitude",latitude)
            formData.append("longitude",longitude)

            let res
            if(reqType === "post"){
                console.log(reqType)
                res = await axios.post("http://localhost:4000/admin/hostels",formData, {withCredentials:true})
            }else{
                res = await axios.put(`http://localhost:4000/admin/hostels/${editId}`, formData, {withCredentials:true})
            }
            toast.success(res.data.message)
            setLoading(false)
            navigate("/admin/hostels")
        } catch (error) {
            setLoading(false)
            console.log(error)
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
          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-8"
          onSubmit={(e)=>handleSubmit(e)}>
            <div className = "flex flex-col gap-2">
                <label className = "p-4">Enter hostel name</label>
                <input className = "p-4 border-b border-gray-700" placeholder="Hostel name"
                value = {name}
                onChange = {(e)=>setName(e.target.value)}/>
            </div>

            <div className="flex flex-col gap-2">
                <label className="p-4">Enter hostel address</label>
                <input className="p-4 border-b border-gray-700" placeholder="Lahore,Johar town" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}/>
            </div>

            <div className="flex flex-col gap-2">
                <label className="p-4">Enter latitude</label>
                <input className="p-4 border-b border-gray-700" placeholder="Paste from google map(31.3456)"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
                <label className="p-4">Enter longitude</label>
                <input className="p-4 border-b border-gray-700" placeholder=" Paste from google map(74.3456)"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
                  <label className="p-4">Select hostel type</label>
                <select className="p-4 border-b border-gray-700" 
                value={type}
                onChange={(e) => setType(e.target.value)}>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="mixed">Mixed</option>
                </select>
            </div>

            {/*<div className="flex flex-col gap-2">
                  <label className="p-4">Upload title image</label>
                <input type="file" className="p-4 border-b border-gray-700"
                onChange={(e) => setPhoto(e.target.files[0])}/>
            </div>*/}
              <div className="flex flex-col gap-2">
                  <label className="p-4">Enter Contact number</label>
                  <input className="p-4 border-b border-gray-700" placeholder="00000000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)} />
              </div>
            
            <div className="flex flex-col gap-2 col-span-2 h-[200px]">
                <label className="p-4">Upload title image</label>
                <FileUpload setFiles={setPhoto} multipleFiles={false}/>
            </div>

            {/*photos */}

            <div className="flex flex-col gap-2 col-span-2 min-h-[200px]">
                  <label className="p-4">Upload hostel images</label>
                
                  <FileUpload setFiles={setImages} multipleFiles={true} files={images} />

                {
                    images.map((i,index)=>{
                        return <div key = {index} className = "flex p-4 bg-gray-100 rounded-md justify-between">
                            <p>{i.file.name}</p>
                            <button type = "button" className="p-2 rounded-md bg-blueSecondary text-white hover:bg-blue-500"
                            onClick = {()=>{
                                const newImages = images.filter((img)=>{
                                    return i.id != img.id
                                })
                                setImages(newImages)
                            }}>delete</button>
                        </div>
                    })
                }


            </div>

              <div className="flex flex-col gap-2 col-span-2">
                  <label className="p-4">Services</label>
                  <input className="p-4 border-b border-gray-700" placeholder="Enter service"
                      value={service}
                      onChange={(e) => setService(e.target.value)} />

                  <div>
                      <button type="button" className="p-2 rounded-md bg-blueSecondary text-white hover:bg-blue-500"
                          onClick={() => {
                              const id = Date.now()
                              const newService = `${id}:${service}`
                              setServices([newService, ...services])
                              setService("")
                          }}>Add service</button>
                  </div>

                  {
                      services.map((s, index) => {
                          const [id, name] = s.split(":")
                          return <div key={index} className="flex p-4 bg-gray-100 rounded-md justify-between">
                              <p>{name}</p>
                              <button type="button" className="p-2 rounded-md bg-blueSecondary text-white hover:bg-blue-500"
                                  onClick={() => {
                                      const newServices = services.filter((se) => {
                                          const sid = se.split(":")[0]
                                          return id != sid
                                      })
                                      setServices(newServices)
                                  }}>delete</button>
                          </div>
                      })
                  }


              </div>
             

            <div className="flex flex-col gap-2 col-span-2">
                  <label className="p-4">Description</label>
                <textarea type="file" className="p-4 border-b w-full border-gray-700" placeholder="Enter all rent related and other information here" rows="10"
                value = {description}
                onChange = {(e)=>setDescription(e.target.value)}/>
            </div>

            <button 
            disabled = {loading}
            type = "submit" 
            className = "rounded-md p-4 bg-blueSecondary text-white hover:bg-blue-400 col-span-2 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-800">Submit</button>

          </form>
      </div>
  )
}

export default Form