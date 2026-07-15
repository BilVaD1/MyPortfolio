import React, { createContext, useContext, useState } from 'react'

export interface ClickedState {
    chat: boolean;
    cart: boolean;
    useProfile: boolean;
    notification: boolean;
}

export type Mode = 'Light' | 'Dark';

export interface MouseConfig {
    lerp: number;
    clickScale: number;
    blendMode: React.CSSProperties['mixBlendMode'];
    glass: boolean;
}

interface StateContextType {
    activeMenu: boolean;
    setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
    isClicked: ClickedState;
    setIsClicked: React.Dispatch<React.SetStateAction<ClickedState>>;
    handleClick: (clicked: keyof ClickedState) => void;
    screenSize: number | undefined;
    setScreenSize: React.Dispatch<React.SetStateAction<number | undefined>>;
    currentMode: Mode;
    setCurrentMode: React.Dispatch<React.SetStateAction<Mode>>;
    mouseConfig: MouseConfig;
    setMouseConfig: React.Dispatch<React.SetStateAction<MouseConfig>>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

const initialState: ClickedState = {
    chat: false,
    cart: false,
    useProfile: false,
    notification: false,
}

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [isClicked, setIsClicked] = useState<ClickedState>(initialState);
    const [screenSize, setScreenSize] = useState<number | undefined>(undefined);
    const [currentMode, setCurrentMode] = useState<Mode>('Dark');
    // Live-tunable props for the SmartMouse cursor (used by the demo page)
    const [mouseConfig, setMouseConfig] = useState<MouseConfig>({ lerp: 1, clickScale: 1, blendMode: undefined, glass: false });

    const handleClick = (clicked: keyof ClickedState) => {
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

export const useStateContext = () => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error('useStateContext must be used within a ContextProvider');
    }
    return context;
}
