import React, { Fragment } from 'react';
import Sidebar from "./miscellaneous/sidebar/Sidebar";
import Navbar from './miscellaneous/navbar/Navbar';
import Chat from './miscellaneous/chat/Chat';
import { ChatState } from "../Context/ContextProvider";
import "./panel.css";

const Panel = () => {
    const { user } = ChatState();

    return (
        <div className="panel-body">
            <Sidebar />

            <div className="chat-panel">
                <Navbar />
                {user && <Chat />}
            </div>
        </div>
    )
}

export default Panel;