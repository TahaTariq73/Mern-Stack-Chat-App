import React, { useState, useEffect } from 'react';
import { ChatState } from "../../../Context/ContextProvider";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';
import axios from "axios";
import "./searchResults.css";

const SearchResults = ({ searchKeyword }) => {
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchUsers, setSearchUsers] = useState([]);

    const { setCurrentChatId } = ChatState();
    
    const fetchSearchUsers = async () => {
        setSearchLoading(true);

        try {
            const { data } = await axios.get(`/api/v1/users?keyword=${searchKeyword}`);
            setSearchUsers(data.users);
            setSearchLoading(false);
        } catch (error) {
            setSearchLoading(false);
            alert(error.response.data.message);
        }
    }

    const createSingleChat = async (userrId) => {
        try {
            const config = { 
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const { data } = await axios.post(
                "/api/v1/accesschat",
                { userId: userrId },
                config
            )

            setCurrentChatId(data.chat._id);
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    useEffect(() => {
        if (searchKeyword) fetchSearchUsers();
    }, [searchKeyword])

    return (
        <div className="searched-ones">
            <p className="seacrh-indi"> Search messages for "{searchKeyword}" </p>

            {searchLoading ? (
                <Stack spacing={1}>
                    <Skeleton variant="rectangular" width={"100%"} height={60} />
                    <Skeleton variant="rectangular" width={"100%"} height={60} />
                    <Skeleton variant="rectangular" width={"100%"} height={60} />
                </Stack>
            ) : (
                <>
                    {searchUsers.map((user, index) => (
                        <div 
                            className={`searched-users-box ${(index + 1) !== searchUsers.length ? "not-last-one" : ""}`} 
                            key={index}
                            onClick={() => createSingleChat(user._id)}
                        >
                            <Avatar> {user.name[0]} </Avatar>
                                        
                            <div>
                                <h3> {user.name} </h3>
                                <p> {user.email} </p>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default SearchResults;