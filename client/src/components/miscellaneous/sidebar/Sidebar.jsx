import React, { useEffect, useRef, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import SearchResults from '../searchResults/SearchResults';
import "./sidebar.css";
import AllChats from '../allChats/AllChats';
import CreateGroupChat from '../createGrpChat/CreateGroupChat';
import { ChatState } from "../../../Context/ContextProvider";

const Sidebar = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [open, setOpen] = useState(false);
    const sidebarDom = useRef(null);

    const { currentChatId } = ChatState();

    useEffect(() => {
        if (currentChatId.length === 0) {
            sidebarDom.current.style.zIndex = 2;
        } else {
            sidebarDom.current.style.zIndex = 1;
        }
    }, [currentChatId])

    return (
        <div className="sidebar-temp" ref={sidebarDom}>
            <div className="sidebar-header">
                <FormControl variant="outlined" style={{ width: "100%" }}>
                    <OutlinedInput
                        type="text"
                        placeholder="Search for users"
                        size="small"
                        style={{
                            backgroundColor: "white"
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton edge="end">
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        fullWidth
                    />
                </FormControl>
            </div>
            
            <div className="sidebar-users">
                {searchKeyword ? (
                    <SearchResults searchKeyword={searchKeyword} />
                ) : (
                    <div className="my-chats">
                        <div className="my-chats-header">
                            <h3> All Chats </h3>
                            
                            <button onClick={() => setOpen(true)}>
                                New Group Chat
                            </button>
                        </div>

                        <AllChats />
                    </div>
                )}
            </div>

            <CreateGroupChat open={open} setOpen={setOpen} />
        </div>
    )
}

export default Sidebar;