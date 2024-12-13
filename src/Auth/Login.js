import React, { useState, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./../Auth/user-auth.css";

const Login = () => {
    const auth = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Start loader
        const payload = JSON.stringify({
            Username: username,
            Password: password,
        });

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            redirect: "follow",
        };

        try {
            const response = await fetch(
                "https://panel.radhetowing.com/api/login",
                requestOptions
            );
            const result = await response.json();

            if (!result.success) {
                toast.error(result.message || "Invalid login credentials");
                setLoading(false); // Stop loader
                return;
            }

            const { role, Username, id } = result.data;
            auth.login({ username: Username, id }, role);
            toast.success("Login successful");
            setLoading(false); // Stop loader

            if (role === "admin") {
                navigate("/dashboard");
            } else if (role === "employee") {
                navigate("/dashboard");
            } else {
                toast.error("Unknown role");
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed: " + error.message);
            setLoading(false); // Stop loader
        }
    };

    return (
        <div className="login-page">
            <ToastContainer />
            <div className="login-container">
                {/* Left Section with Image and Title */}
                <div className="login-left">
                    <div className="image-grid">
                        <img
                            src="/images/Radhe-B1.png"
                            alt="Main"
                            className="main-image"
                        />
                    </div>
                </div>

                {/* Right Section with Form */}
                <div className="login-right">
                    {loading ? ( // Show loader if loading
                        <div className="loader-container">
                            <div className="loader"></div>
                        </div>
                    ) : (
                        <form className="form-login" onSubmit={onSubmit}>
                            <h1 className="heading">Login</h1>
                            <input
                                type="text"
                                placeholder="Email or Phone Number"
                                className={`input ${username ? "" : "error"}`}
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
                            <button
                                className="btn"
                                disabled={!username || !password || loading} // Disable button if loading
                            >
                                Login
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
