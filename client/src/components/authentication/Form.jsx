import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import "./form.css";

const Form = () => {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <div className="form-temp">
            <div className="form-header">
                <h1> {tabIndex === 0 ? "My account" : "Create my account"} </h1>

                <div className="form-tabs">
                    <div className={`form-tab ${tabIndex === 0 ? "active-tab" : ""}`} onClick={() => setTabIndex(0)}>
                        Login
                    </div>
                        
                    <div className={`form-tab ${tabIndex === 1 ? "active-tab" : ""}`} onClick={() => setTabIndex(1)}>
                        Sign up
                    </div>
                </div>

                {tabIndex === 0 ? (
                    <Login />
                ) : (
                    <Register />
                )}
            </div>
        </div>
    )
}

export default Form;