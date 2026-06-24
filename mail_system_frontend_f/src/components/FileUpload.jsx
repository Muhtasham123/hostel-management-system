import { useRef, useState } from "react"

export default function FileUpload({ setFiles, multipleFiles, files }) {
    const inputRef = useRef(null)
    const [fileName, setFileName] = useState(null)
    const [isUploaded, setIsUploaded] = useState(false)

    const handleFile = (file) => {
        if (!file) {
            return
        }
        if(multipleFiles){
            setFiles([file, ...files])
        }else{
            setFiles(file)
            setIsUploaded(true)
            setFileName(file.file.name)
        }
    }

    return (
        <div className="w-full h-full">

            {/* Drop Zone */}
            <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault()
                    const newFile = {
                        id: Date.now(),
                        file: e.dataTransfer.files[0]
                    }
                    handleFile(newFile)
                }}
                className={`border-2 w-full flex items-center justify-center h-full border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition ${isUploaded ? "bg-green-50":""}`}
            >
                {
                    isUploaded ?
                    <button 
                    onClick = {(e)=>{
                        e.stopPropagation()
                        setIsUploaded(false)
                        setFiles(null)
                        setFileName(null)
                    }}
                    className = "mr-1 text-2xl text-gray-600 p-2 hover:text-gray-700" type="button">x</button>
                    :
                    <></>
                }
                <p className="text-gray-600 font-bolder text-lg">
                    {
                        isUploaded ? 
                        fileName 
                        :
                        "Drag & drop file here or " 
                    }
                    <span className="text-blue-500">browse</span>
                </p>
            </div>

            {/* Hidden Input */}
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                    const newFile = {
                        id:Date.now(),
                        file:e.target.files[0]
                    }
                    handleFile(newFile)
                    if(multipleFiles){  
                        e.target.value = ""
                    }
                }}
            />
        </div>
    )
}
