import React from 'react'
import { FaCircleUser } from "react-icons/fa6";
import { GoReply } from "react-icons/go";
import {useState, useRef, useEffect, useContext} from "react"
import { IoSend } from "react-icons/io5";
import axios from "axios"
import {toast} from "react-toastify"
import { context } from 'context';
import { MdDelete } from "react-icons/md";
import Stars from 'components/Stars';

const Review = ({data, setRefreshReviews, refreshReviews, setReplyId, setDeleteModelOpen, extra}) => {
    const {hostelContext} = useContext(context)
    const replyBoxRef = useRef(null)
    const [activeReviewId, setActiveReviewId] = useState(null)
    const [reply, setReply] = useState("")

    const sendReply = async()=>{
        try {
            const res = await axios.post(`http://localhost:4000/admin/replies/${hostelContext}/${activeReviewId}`,{description:reply}, {withCredentials:true})

            toast.success(res.data.message)
            setRefreshReviews(refreshReviews+1)
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                console.log(error)
                toast.error("Failed to store reply")
            }
        }
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                replyBoxRef.current &&
                !replyBoxRef.current.contains(e.target)
            ) {
                setActiveReviewId(null)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

  return (
    <ul className = {`list-none ${extra}`}>
        {
            data.map((r)=>{
                return(
                    <li key={r.review_id} className="p-4 text-lg">
                    <div className="mb-2">
                        <div className = "flex gap-2 items-center">
                            <FaCircleUser size = {50} className = "text-gray-500"/>
                            <div>
                                <p className = "font-bold text-gray-800">{r.reviewer}</p>
                                <Stars num={r.rat} extras={null} starSize="text-sm"/>
                            </div>
                        </div>
                        
                        <div className = "flex items-end gap-2">
                            <p className = "ml-[55px]">{r.rev_text}</p>
                            <button className = "p-1 hover:bg-gray-300 text-gray-700"
                            onClick = {()=>setActiveReviewId(r.review_id)}>
                                <GoReply />
                            </button>
                        </div>
                    </div>
                    {
                        r.replier ? 
                        <div className="ml-10 border-l border-gray-500 p-1">
                            <div className="flex gap-2 items-center">
                                <FaCircleUser className="text-gray-500 text-2xl" />
                                <p className="font-bold text-gray-800">{r.replier}</p>
                            </div>

                            <div className="flex items-end gap-2">
                                <p className="ml-7">{r.rep_text}</p>
                                <button 
                                onClick = {()=>{
                                    setReplyId(r.reply_id)
                                    setDeleteModelOpen(true)
                                }} 
                                className="p-1 hover:bg-gray-300 text-gray-700" ><MdDelete /></button>
                            </div>
                        </div>
                        :
                        <></>
                    }

                    {   
                        activeReviewId == r.review_id ?
                        <div ref={replyBoxRef} className = "relative w-full">

                            <input autoFocus type="text" className="w-full pr-12 p-2 border border-gray-600 rounded-2xl outline-none" placeholder="Enter your reply"
                            value={reply}
                            onChange={(e)=>setReply(e.target.value)}
                             />

                            <button
                            onClick={()=>{
                                sendReply()
                                setActiveReviewId(null)
                                setReply("")
                            }
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800"

                            >
                            <IoSend />

                            </button>
                        </div>
                        :
                        <></>
                    }
                </li>
                )
                
            })
        }
    </ul>
  )
}

export default Review