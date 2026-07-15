import React, { createContext, useContext, useState } from 'react'

const StateContext = createContext();

const initialState = {
    chat: false,
    cart: false,
    useProfile: false,
    notification: false,
}

export const ContextProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [isClicked, setIsClicked] = useState(initialState);
    const [screenSize, setScreenSize] = useState(undefined);
    const [currentMode, setCurrentMode] = useState('Dark');
    // Live-tunable props for the SmartMouse cursor (used by the demo page)
    const [mouseConfig, setMouseConfig] = useState({ lerp: 1, clickScale: 1, blendMode: undefined, glass: false });

    const handleClick = (clicked) => {
        setIsClicked({...initialState, [clicked]:true})
    }

    return (
        <StateContext.Provider
            value={{ activeMenu,
                setActiveMenu,
                isClicked,
                setIsClicked,
                handleClick,
                screenSize,
                setScreenSize,
                currentMode,
                setCurrentMode,
                mouseConfig, setMouseConfig

            } /* Transport states in each Component */}
        >
                {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)
