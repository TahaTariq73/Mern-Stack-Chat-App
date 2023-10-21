import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatContext = createContext();

const ContextProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState();
    const [currentChatId, setCurrentChatId] = useState("");
    const [notifications, setNotifications] = useState([]);

    const loadUser = async () => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) navigate("/");
    }

    useEffect(() => {
        loadUser();
    }, [navigate])

    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                currentChatId,
                setCurrentChatId,
                notifications,
                setNotifications
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ContextProvider;