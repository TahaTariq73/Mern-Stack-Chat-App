import React, { Fragment, useState } from 'react';
import { ChatState } from "../../Context/ContextProvider";
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { setUser } = ChatState();

    const registerUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const config = { 
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const { data } = await axios.post(
                "/api/v1/register",
                { name, email, password },
                config
            )

            localStorage.setItem("userInfo", JSON.stringify(data.user));
            setUser(data.user);
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            setLoading(false);
            alert(error.response.data.message);
        }
    }

    return (
        <Fragment>
            <form className="actual-form" onSubmit={registerUser}>
                <TextField 
                    label="Name" 
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    required
                    fullWidth 
                />

                <TextField 
                    label="Email" 
                    variant="standard"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    fullWidth 
                />

                <TextField 
                    label="Password" 
                    variant="standard"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    fullWidth 
                />

                <button type="submit" className="form-btn" disabled={loading}>
                    {!loading ? (
                        <span> Create account </span>
                    ) : (
                        <CircularProgress size={"1rem"} color="inherit" />
                    )}
                </button>
            </form>
        </Fragment>
    )
}

export default Register;