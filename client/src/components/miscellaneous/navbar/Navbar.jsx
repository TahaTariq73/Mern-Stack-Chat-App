import React, {useState} from 'react';
import Button from '@mui/material/Button';
import { Avatar } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ChatState } from "../../../Context/ContextProvider";
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import NotificationsIcon from '@mui/icons-material/Notifications';
import "./navbar.css";

const Navbar = () => {
    const { user, notifications } = ChatState();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div className="navbar">
            <div className="logo">
                <span> Talk-Shit </span>
            </div>

            <div className="nav-options">
                {notifications.length > 0 && 
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        {notifications.map((notification) => (
                            <div className='notifi'>
                                <p> Message from <b> {notification.sender.name} "{notification.content}" </b> </p>
                            </div>
                        ))}
                    </Popover>
                }

                <Badge badgeContent={notifications.length} color='primary' style={{ cursor: "pointer" }} onClick={handleClick}>
                    <NotificationsIcon />
                </Badge>

                <Button style={{ color: "white" }}>
                    <Avatar> {user && user.name[0]} </Avatar>   
                    <KeyboardArrowDownIcon />
                </Button>
            </div>
        </div>
    )
}

export default Navbar;