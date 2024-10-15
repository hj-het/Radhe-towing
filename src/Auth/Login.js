import React, { useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "./../Auth/user-auth.css";

const Login = () => {
    const auth = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        const payload = JSON.stringify({
            Username: username,
            Password: password
        });

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            redirect: "follow"
        };

        try {
            const response = await fetch('https://panel.radhetowing.com/api/login', requestOptions);
            const result = await response.json();

            if (!result.success) {
                toast.error(result.message || "Invalid login credentials");
                return;
            }

            const { role, Username, id } = result.data;
            auth.login({ username: Username, id }, role);
            toast.success("Login successful");

            if (role === "admin") {
                navigate('/dashboard');
            } else if (role === "employee") {
                navigate('/member');
            } else {
                toast.error("Unknown role");
            }
        } catch (error) {
            console.error(error);
            toast.error('Login failed: ' + error.message);
        }
    };

    return (
        <div className="login-page">
            <ToastContainer />
            <div className="login-container">
                {/* Left Section with Image and Title */}
                <div className="login-left">
                    {/* <h2>Radhe Towing Service</h2> */}
                    <div className="image-grid">
                        <img src="/images/Radhe-B1.png" alt="Main" className="main-image" />
                        {/* <div className="hexagon-images">
                            <img src="/path-to-image1.jpg" alt="Small 1" className="hex-image" />
                            <img src="/path-to-image2.jpg" alt="Small 2" className="hex-image" />
                            <img src="/path-to-image3.jpg" alt="Small 3" className="hex-image" />
                        </div> */}
                    </div>
                </div>

                {/* Right Section with Form */}
                <div className="login-right">
                    <form className="form" onSubmit={onSubmit}>
                        <h1 className="heading">Login</h1>
                        <input
                            type="text"
                            placeholder="Email or Phone Number"
                            className={`input ${username ? '' : 'error'}`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* <div className="link-wrapper">
                            <a href="/reset-password">Reset Password?</a>
                        </div> */}
                        <button className="btn" disabled={!username || !password}>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
