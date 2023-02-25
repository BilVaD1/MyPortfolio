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
    const [currentColor, setCurrentColor] = useState('#03C9D7');
    const [currentMode, setCurrentMode] = useState('Dark');
    const [themeSettings, setThemeSettings] = useState(false);
    const [mouseWidth, setMouseWidth] = useState('35px');
    const [mouseHeight, setMouseHeight] = useState('35px');
    const [mouseTop, setMouseTop] = useState(-5);
    const [mouseLeft, setMouseLeft] = useState(-10);
    const [mouseColor, setMouseColor] = useState('rgba(0, 0, 0, 0.5)');
    const [scrollPosition, setScrollPosition] = useState(0);

    const setColor = (color) => {
        setCurrentColor(color);
        localStorage.setItem('colorMode', color)
        setThemeSettings(false)
    }


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
                setColor,
                themeSettings, setThemeSettings,
                mouseWidth, setMouseWidth,
                mouseHeight, setMouseHeight,
                mouseTop, setMouseTop,
                mouseLeft, setMouseLeft,
                mouseColor, setMouseColor,
                scrollPosition, setScrollPosition

            } /* Transport states in each Component */}
        >
                {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)