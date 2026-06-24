import {useState, useEffect} from "react"
import { GrNext } from "react-icons/gr";
import { MdOutlineArrowBackIos } from "react-icons/md";


export default function Slider({ images, extras }){
    const [turn, setTurn] = useState(0)

    useEffect(() => {
        if (!images || images.length === 0) return

        const interval = setInterval(() => {
            setTurn(prev => (prev + 1) % images.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [images.length])

    const getPosition = (index) => {
        if (index === turn) return "translate-x-0 z-20"
        if (index === (turn + 1) % images.length) return "translate-x-full z-10"
        if (index === (turn - 1 + images.length) % images.length) return "-translate-x-full z-10"
        return "translate-x-full opacity-0"
    }

    return (
        <div className="flex items-center">
            <button
                className="text-3xl p-3 text-blue-600 mr-1 rounded-md hover:bg-gray-400"
                onClick={() =>
                    setTurn(prev => (prev - 1 + images.length) % images.length)
                }
            >
                <MdOutlineArrowBackIos />
            </button>

            <div className={`${extras} overflow-hidden relative`}>
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt="photo"
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out ${getPosition(index)}`}
                    />
                ))}
            </div>

            <button
                className="text-3xl p-3 text-blue-600 ml-1 rounded-md hover:bg-gray-400"
                onClick={() => setTurn(prev => (prev + 1) % images.length)}
            >
                <GrNext />
            </button>
        </div>
    )
}
