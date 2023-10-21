import React, { useEffect, useState } from 'react';
import { ChatState } from "../../../Context/ContextProvider";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';
import axios from "axios";
import "./allchats.css";

const AllChats = () => {
    const [chatsLoading, setChatsLoading] = useState(false);
    const [myChats, setMyChats] = useState([]);

    const { setCurrentChatId, user } = ChatState();

    const fetchAllChats = async () => {
        setChatsLoading(true);

        try {
            const { data } = await axios.get(`/api/v1/allchats`);
            setMyChats(data.chats);
            setChatsLoading(false);
        } catch (error) {
            setChatsLoading(false);
            alert(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchAllChats();
    }, [])

    return (
        <div className="my-all-chats">
            {chatsLoading || !user ? (
                <Stack spacing={1}>
                    <Skeleton variant="rectangular" width={"100%"} height={60} />
                    <Skeleton variant="rectangular" width={"100%"} height={60} />
                    <Skeleton variant="rectangular" width={"100%"} height={60} />
                </Stack>
            ) : (
                <>
                    {myChats.map((chat, index) => (
                        <div 
                            className={`searched-users-box ${(index + 1) !== myChats.length ? "not-last-one" : ""}`} 
                            key={index}
                            onClick={() => setCurrentChatId(chat._id)}
                        >
                            {chat.isGroupChat ? (
                                <Avatar> {chat.chatName[0]} </Avatar>
                            ) : (
                                <Avatar> {chat.users[0]._id === user._id ? chat.users[1].name[0] : chat.users[0].name[0]} </Avatar>
                            )}
                                        
                            <div>
                                {chat.isGroupChat ? (
                                    <h3> {chat.chatName} </h3>
                                ) : (
                                    <h3> {chat.users[0]._id === user._id ? chat.users[1].name : chat.users[0].name} </h3>
                                )}

                                <p> {chat.latestMessage ? chat.latestMessage.content : "You guys are connected now"} </p>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default AllChats;