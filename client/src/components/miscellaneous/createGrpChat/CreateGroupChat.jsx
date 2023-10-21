import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import "./createGroupChat.css";

const CreateGroupChat = ({ open, setOpen }) => {
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userIds, setUserIds] = useState([]);
    const [searchOne, setSearchedOne] = useState("");
    const [groupName, setGroupName] = useState("");

    const fetchSingleUser = async () => {
        setSearchLoading(true);

        try {
            const { data } = await axios.get(`/api/v1/user?keyword=${searchOne}`);
            setSelectedUsers([data.user, ...selectedUsers]);
            setUserIds([data.user._id, ...userIds]);
            setSearchLoading(false);
            setSearchedOne("");
        } catch (error) {
            setSearchLoading(false);
            alert(error.response.data.message);
        }
    }

    const ccreateGroupChat = async () => {
        try {
            const config = { 
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const { data } = await axios.post(
                `/api/v1/creategroupchat`,
                {
                    users: userIds,
                    chatName: groupName
                },
                config
            )
            
            setSelectedUsers([]);
            setUserIds([]);
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            fetchSingleUser();
        }
    }

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(!open)}
        >
            <DialogTitle> Create Group Chat </DialogTitle>
            
            <DialogContent 
                style={{ 
                    width: "330px", 
                    padding: "1rem", 
                    display: "flex", 
                    flexDirection: "column",
                    gap: "1rem"
            }}>
                {selectedUsers.length > 0 && (
                    <div className="users-chips">
                        {selectedUsers.map((selectedOne, index) => (
                            <Chip label={`${selectedOne.name}`} color="primary" key={index} />
                        ))}
                    </div>
                )}

                <TextField 
                    label="Chat name" 
                    variant="outlined"
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                    fullWidth 
                />

                <TextField 
                    label="Add users e.g badman123" 
                    variant="outlined"
                    type="text"
                    value={searchOne}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => setSearchedOne(e.target.value)}
                    required
                    fullWidth 
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={submitReviewToggle} color="secondary">
                    Cancel
                </Button>

                <Button onClick={ccreateGroupChat} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateGroupChat;