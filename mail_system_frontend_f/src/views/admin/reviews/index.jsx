import React from 'react'
import Review from "components/review/index"
import {useEffect, useState, useContext} from "react"
import { context } from 'context'
import {useParams} from "react-router-dom"
import axios from "axios"
import {toast} from "react-toastify"
import {BounceLoader} from "react-spinners"

const Reviews = () => {
    const {hostel_id} = useParams()
    const [reviews, setReviews] = useState({})
    const [refreshReviews, setRefreshReviews] = useState(0)
    const {setHostelContext} = useContext(context)
    const [loading, setLoading] = useState(true)

    const fetchReviews = async()=>{
        try {
            setLoading(true)
            const res = await axios.get(`http://localhost:4000/admin/reviews/${hostel_id}/all`, { withCredentials: true })

            console.log(res.data.data)
            setReviews(res.data.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
            if(error.response){
                toast.error(error.response.data.message)
            }else{
                toast.error("Failed to fetch reviews")
            }
            
        }
    }

    useEffect(()=>{
        setHostelContext(hostel_id)
        fetchReviews()
    },[refreshReviews])

  return (
    loading ?
   
        <div className = "h-[100vh] w-full flex justify-center items-center"><BounceLoader color="#0b24c7" /></div>

        :

      <div
          className={`!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none`}
      >
          <Review data = {reviews.reviewsList} refreshReviews={refreshReviews} setRefreshReviews={setRefreshReviews}/>
      </div>
  )
}

export default Reviews