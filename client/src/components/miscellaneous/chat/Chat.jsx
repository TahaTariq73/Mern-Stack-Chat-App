import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ChatState } from "../../../Context/ContextProvider";
import { Avatar } from '@mui/material';
import { io } from 'socket.io-client';
import axios from 'axios';
import "./chat.css";

const ENDPOINT = "http://localhost:5000";
var socket;
var selectedChatCompare;

const Chat = () => {
    const [sendLoading, setSendLoading] = useState(false);
    const [allMessages, setAllMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [message, setMessage] = useState("");
    const [opponentUser, setOpponentUser] = useState(null);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const { 
        currentChatId, 
        setCurrentChatId, 
        user, 
        notifications,
        setNotifications
    } = ChatState();

    const sendMessage = async () => {
        setSendLoading(true);
        socket.emit("stop typing", currentChatId);

        try {
            const config = { 
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const { data } = await axios.post(
                `/api/v1/message`,
                {
                    content: message,
                    chatId: currentChatId
                },
                config
            )
        
            socket.emit("new message", data.message);
            setAllMessages([...allMessages, data.message]);
            setSendLoading(false);
            setMessage("");
        } catch (error) {
            setSendLoading(false);
            alert(error.response.data.message);
        } 
    }

    const validContent = () => {
        if (message.length !== 0) {
            sendMessage();
        }
    }

    const fetchMessages = async () => {
        setMessagesLoading(true);

        try {
            const { data } = await axios.get(`/api/v1/messages/${currentChatId}`);
        
            setAllMessages(data.messages);
            setMessagesLoading(false);
            setOpponentUser(data.opponentUser);
            socket.emit("join chat", currentChatId);
        } catch (error) {
            setMessagesLoading(false);
            alert(error.response.data.message);
        }
    }

    const typingHandler = (e) => {
        setMessage(e.target.value);
    
        if (!socketConnected) return;
    
        if (!typing) {
            setTyping(true);
            socket.emit("typing", currentChatId);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
          
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", currentChatId);
                setTyping(false);
            }

        }, timerLength);
    }

    useEffect(() => {
        if (currentChatId.length !== 0) fetchMessages();

        selectedChatCompare = currentChatId;
    }, [currentChatId])

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, [])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare !== newMessageRecieved.chat._id) {
                if (!notifications.includes(newMessageRecieved)) {
                    setNotifications([newMessageRecieved, ...notifications]);
                }
            } else {
                setAllMessages([...allMessages, newMessageRecieved]);
            }
        })
    })

    return (
        <div className='chat-interface'>
            {currentChatId.length === 0 ? (
                <div className="chatid-none">
                    <span> Please select a chat to talk shit </span>
                </div>
            ) : (
                <div className="chat">
                    <Button 
                        size='small' 
                        style={{ backgroundColor: "#E2EEF7", color: "black" }} 
                        className='res-back' 
                        onClick={() => setCurrentChatId("")}
                    >
                        <ArrowBackIcon />
                    </Button>

                    <div className='messages'>
                        {allMessages && user && allMessages.map(message => (
                            <div key={message._id} className={`${message.sender._id === user._id ? "my-message" : "oppo-message"}`}>
                                {message.sender._id === user._id ? (
                                    <span> {message.content} </span> 
                                ) : (
                                    <div className='oppo-content'>
                                        {Array.isArray(opponentUser) ? (
                                            <Avatar size="small"> {message.sender.name[0]} </Avatar>
                                        ) : (
                                            <Avatar size="small"> {message.sender.name[0]} </Avatar>
                                        )} 
                                        <span> {message.content} </span>
                                    </div>        
                                )}
                            </div>
                        ))}

                        {istyping ? (
                            <div className='oppo-message'>
                                <div className="oppo-content">
                                    <div className='typing-dots'>
                                        <div className='typing-dot'></div>
                                        <div className='typing-dot'></div>
                                        <div className='typing-dot'></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <> </>
                        )}

                        <br /> <br /> <br /> <br /> <br /> <br />
                    </div>

                    <div className='text-field'>
                        <FormControl variant="outlined" style={{ width: "90%" }}>
                            <OutlinedInput
                                type="text"
                                placeholder="Type here"
                                size="small"
                                style={{
                                    backgroundColor: "white",
                                }}
                                value={message}
                                onChange={typingHandler}
                                fullWidth
                            />
                        </FormControl>

                        <Button 
                            variant="contained" 
                            size='large' 
                            style={{ backgroundColor: "#F44646" }}
                            onClick={validContent}
                            disabled={sendLoading}
                        >
                            <SendIcon />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Chat;