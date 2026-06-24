import React from 'react'

const Collage = ({images, extras}) => {
  return (
    <div className = {`grid ${extras}`}>
        {
            images.map((img,index)=>{
                return (
                    <div key={index} className = "h-full w-full">
                        <img src = {img} alt="photo" className = "h-full w-full object-cover"/>
                    </div>
                )
            })
        }
    </div>
  )
}

export default Collage