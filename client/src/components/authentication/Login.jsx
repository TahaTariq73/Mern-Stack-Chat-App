import React, { Fragment, useState } from 'react';
import TextField from '@mui/material/TextField';
import { ChatState } from "../../Context/ContextProvider";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { setUser } = ChatState();

    const loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const config = { 
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const { data } = await axios.post(
                "/api/v1/login",
                { email, password },
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
            <form className="actual-form" onSubmit={loginUser}>
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
                        <span> Login </span>
                    ) : (
                        <CircularProgress size={"1rem"} color="inherit" />
                    )}
                </button>
            </form>
        </Fragment>
    )
}

export default Login;