import { createContext, useState } from "react";

export const context = createContext()

const ContextProvider = ({children})=>{
    const [hostelContext, setHostelContext] = useState("")

    return(
    <context.Provider value = {
        {
            hostelContext,
            setHostelContext
        }
    }>
        {children}
    </context.Provider>
    )
}

export default ContextProvider