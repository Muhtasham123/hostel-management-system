import React from 'react'
import { MdStar } from "react-icons/md";

const Stars = ({num, extras, starSize}) => {
    const rating = Array.from({ length: num })
  return (
    <div className = {`flex ${extras} text-gray-900`}>
        {
            rating.map((rat, index) => {
                return (
                    <li key={index}><MdStar className = {starSize}/></li>
                )
            })
        }
    </div>
  )
}

export default Stars