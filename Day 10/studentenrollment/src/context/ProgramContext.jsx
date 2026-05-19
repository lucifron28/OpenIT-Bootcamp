import { createContext, useState } from "react";


const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
    const [programs, setPrograms] = useState([]);

    return (
        <ProgramContext.Provider
        value={{ programs, setPrograms }}>
            {children}
        </ProgramContext.Provider>
    )
}


export const useProgramContext = () => {
    const context = useContext(ProgramContext);
    if (!context) {
        throw new Error("useProgramContext must be used within a ProgramProvider");
    }
    return context;
}