import {useState, useEffect, useContext, useRef} from 'react'
import {useParams, Link} from "react-router-dom"
import axios from "axios"
import {toast} from "react-toastify"
import {BounceLoader} from "react-spinners"
import { IoLocationSharp } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import Map from "components/map/index";
import Review from "components/review/index";
import {context} from "context"
import { MdOutlineArrowDropDown } from "react-icons/md";
import { MdOutlineArrowDropUp } from "react-icons/md";
import DeleteModel from './DeleteModel'
import Collage from "components/Collage"
import { IoMdArrowBack } from "react-icons/io";
import Stars from 'components/Stars'

const PublicView = () => {
    const heightRef = useRef(null)
    const servicesRef = useRef(null)
    const {setHostelContext} = useContext(context)
    const {hostel_id} = useParams()
    const [data, setData] = useState({})
    const [reviews, setReviews] = useState({})
    const [refreshReviews, setRefreshReviews] = useState(0)
    const [loading, setLoading] = useState(true)
    const [reviewsLoading, setReviewsLoading] = useState(true)
    const [showDesc, setShowDesc] = useState(false)
    const [showServices, setShowServices] = useState(false)
    const [deleteModelOpen, setDeleteModelOpen] = useState(false)
    const [replyId, setReplyId] = useState("")

    const fetchData = async(url)=>{
        try {
            
            const res = await axios.get(url ,{withCredentials:true})

            console.log(res.data.data)
            return res.data.data

        } catch (error) {
            
            if(error.response){
                toast.error(error.response.data.message)
            }else{
                console.log(error)
                toast.error("Failed to fetch hostel data")
            }
        }
    }

    useEffect(()=>{
        const run = async()=>{
            setHostelContext(hostel_id)
            setLoading(true)
            const result = await fetchData(`http://localhost:4000/admin/hostels/${hostel_id}`)
            setData(result)
            setLoading(false)
        }
        run()
    },[hostel_id])

    useEffect(() => {
        const run = async()=>{
            setReviewsLoading(true)
            const result = await fetchData(`http://localhost:4000/admin/reviews/${hostel_id}/all`)
            setReviews(result)
            console.log(result)
            setReviewsLoading(false)
        }
        run()
    }, [refreshReviews])

  return (
    loading && data?
      <div className = "h-[100vh] w-full flex justify-center items-center"><BounceLoader color="#0b24c7" /></div>
      :
      <div className="text-gray-900">
      {
        deleteModelOpen ?
        <DeleteModel 
        replyId = {replyId}
        setReplyId={setReplyId} 
        setDeleteModelOpen={setDeleteModelOpen}
        setRefreshReviews={setRefreshReviews}
        refreshReviews={refreshReviews}/>
        :
        <></>
      }

      <div
          className={`p-10 bg-white dark:!bg-navy-800 dark:text-white dark:shadow-none $`}
      >

      <div className = "fixed top-0 z-10 bg-white w-full p-8 pb-0">
          <Link to={`/admin/default/${hostel_id}`}
          className = "text-2xl text-blue-500 p-4 font-bolder hover:text-blueSecondary flex items-center gap-2">
            <IoMdArrowBack />
            Back to Dashboard
          </Link>
            <hr />
      </div>


      <div className = "mt-20 p-[70px] pt-0">
        <h1 className="font-bold text-3xl mb-5">
            {data.hostels[0].name.toUpperCase() + " | " + "FOR " + data.hostels[0].type.toUpperCase()}
        </h1>

      <div className = "grid gap-2 grid-cols-1 lg:grid-cols-2 rounded-lg overflow-hidden">
        <div>
            <img src={data.hostels[0].photo} alt="photo" className= "h-full w-full object-cover"/>
        </div>

        {
            data.hostels[0].imgs ?
                <Collage images={data.hostels[0].imgs.split(',')} extras="grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-2" />
                :
                <div className="w-full h-[300px] bg-gray-200 mt-10 flex items-center justify-center">
                    <h1>Images not provided</h1>
                </div>
        }
      </div>

        <div className= "flex flex-col gap-3 mt-5  mb-[10px]">
            <h1 className = "font-bold text-3xl">
                {data.hostels[0].location}
            </h1>
            <div>
                {
                    "Since " + new Date(data.hostels[0].created_at).getFullYear()
                }
            </div>

            {/*<div className = "flex gap-2 items-center">
                <IoLocationSharp className = "text-red-500"/>
                <p>{data.hostels[0].location}</p>
            </div>

            <div className="flex gap-2 items-center">
                <FaPhone className = "text-blue-500"/> 
                <p>{data.hostels[0].contact}</p>
            </div>*/}
        </div>

        <div className = "flex justify-center gap-8 border border-gray-400 rounded-lg p-4 mb-[50px] w-[30%]">
            {reviewsLoading ?
                <div className="w-full flex justify-center items-center"><BounceLoader color="#0b24c7" /></div>
                :
                <div className = "w-full">
                    <div className = "flex flex-col items-center justify-center text-lg">
                        <p>{reviews.reviewsList.length}</p>
                        <p>Reviews</p>
                    </div>

                    <div className = "w-[1px] border border-gray-400"></div>
                    <div className = "flex flex-col items-center justify-center text-lg">
                        <p>{reviews.overall_rating ? reviews.overall_rating + ".0" : "No rating given yet"}</p>
                        <ul className="list-none">
                            <Stars num={reviews?.overall_rating || 0} extras={null} />
                        </ul>
                    </div>
                </div>
            }
        </div>

        <hr/>
      
      <div className = "grid grid-cols-1 lg:grid-cols-2 gap-[100px] mt-[50px] mb-[50px]">
        <div>
            <h1 className="text-3xl flex items-center gap-2">About This Place</h1>
            <p
                ref={heightRef}
                style={{
                    maxHeight: showDesc && heightRef.current ? `${heightRef.current.scrollHeight}px` : "50px"
                }}
                className={`mt-5 transition-all overflow-hidden text-lg text-gray-700`}>
                {data.hostels[0].description}
            </p>
            <button
                onClick={() => setShowDesc(!showDesc)}
                className='mt-2 flex items-center gap-1 justify-center bg-blueSecondary rounded-lg p-4 text-md font-bold text-white hover:bg-blue-500'>
                {showDesc ? "Show Less" : "Show More"}
                {showDesc ? <MdOutlineArrowDropUp className="text-lg" /> : <MdOutlineArrowDropDown className="text-lg" />}
            </button>
        </div>

      <div>
        <h1 className="text-3xl flex items-center gap-2">What We Offer</h1>

        <ul
        ref={servicesRef}
        style = {{
            maxHeight: showServices && servicesRef.current ? `${servicesRef.current.scrollHeight}px` : "100px"
        }} 
        className="list-none mt-5 grid grid-cols-2 gap-4 overflow-hidden transition-all">

            {
                data.hostels[0].serv.split(",").map((s, i)=>{
                    return <li key={i} className = "border border-gray-400 rounded-lg p-4 text-gray-700">{s.split(":")[1].toUpperCase()}</li>
                })
            }
        </ul>

        <button
            onClick={() => setShowServices(!showServices)}
            className='mt-2 flex items-center gap-1 justify-center bg-blueSecondary rounded-lg p-4 text-md font-bold text-white hover:bg-blue-500'>
            {showServices ? "Show Less" : "Show More"}
            {showServices ? <MdOutlineArrowDropUp className="text-lg" /> : <MdOutlineArrowDropDown className="text-lg" />}
        </button>
      </div>
    </div>

    <hr/>

    {!reviewsLoading ?
    <div className = "mt-[50px] mb-[50px]">
        <h1 className="text-3xl flex items-center gap-2">
            Overall Rating
        </h1>
        <div className = "flex gap-4 w-full justify-center items-center">
            <div className= "w-[70px] h-[120px]">
                <img src="/ratingLogo1.png" alt="photo" className = "w-full h-full object-cover"/>
            </div>
            <div className = "flex flex-col justify-center items-center">
                <p className ="text-[100px] text-gray-900">
                    {
                        reviews.overall_rating ? reviews.overall_rating + ".0" : "0.0"
                    }
                </p>
                <ul className = "list-none">
                    <Stars num = {reviews.overall_rating} extras={null} starSize="text-3xl"/>
                </ul>
            </div>
            <div className="w-[70px] h-[120px]">
                <img src="/ratingLogo2.png" alt = "photo" className="w-full h-full object-cover" />
            </div>
        </div>
        <div className = "flex justify-center mt-5">
            <p className="p-8 border border-gray-400 text-lg text-gray-600 rounded-md text-center">
                {
                    reviews.overall_rating ? `The Overall rating of this place is ${reviews.overall_rating} out of `
                    :
                    "No rating given yet"
                }
            </p>
        </div>
    </div>
    :
    null
    }

    <hr/>
        
        {
            loading ? 
            <div className="w-full flex justify-center items-center"><BounceLoader color="#0b24c7" /></div>
            :
            data.hostels[0].latitude > 0 && data.hostels[0].longitude > 0 ?
                <div className="w-full flex flex-col gap-2 mt-[50px] mb-[50px]">
                    <h1 className="text-3xl flex items-center gap-2">
                        Where You Will Be
                    </h1>
                    <Map
                        latitude={Number.parseFloat(data.hostels[0].latitude)}
                        longitude={Number.parseFloat(data.hostels[0].longitude)} />
                </div>
                :
                <div className="w-full h-[300px] bg-gray-200 mt-10 flex items-center justify-center">
                    <h1>Location not provided</h1>
                </div>
        }
      
        <hr/>

      <div className = "mt-[50px] mb-[50px]">
            <div className = "flex items-center justify-between">
                <h1 className="text-3xl flex items-center gap-2">What People Think About This Place</h1>
                <Link to={`/admin/reviews/${hostel_id}`}
                className = "text-blue-500 hover:text-blue-700 font-bold">See all reviews</Link>
            </div>

        {
            !reviewsLoading ?
            reviews.reviewsList.length == 0 ?
            <p className = "text-gray-600">No reviews yet</p>
            :
            <Review 
            data = {reviews.reviewsList} 
            setRefreshReviews = {setRefreshReviews} 
            refreshReviews = {refreshReviews}
            setReplyId={setReplyId}
            setDeleteModelOpen={setDeleteModelOpen}
            extra = "grid grid-cols-1 lg:grid-cols-2 text-gray-700"/>
            :
            <div className="w-full flex justify-center items-center"><BounceLoader color="#0b24c7" /></div>
        }
      </div>
     </div>
    </div>
    </div>
  )
}

export default PublicView