import React, { useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "./../Auth/user-auth.css";

const Login = () => {
    const auth = useContext(AuthContext); // Use AuthContext for login and role
    const [username, setUsername] = useState(""); // Username input only
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();

        // Create payload for fetch request
        const payload = JSON.stringify({
            Username: username, // API expects keys 'Username' and 'Password'
            Password: password
        });

        // Fetch API options
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: payload,
            redirect: "follow"
        };

        try {
            const response = await fetch('https://panel.radhetowing.com/api/login', requestOptions);
            const result = await response.json(); // Parse JSON response

            if (!result.success) {
                toast.error(result.message || "Invalid login credentials");
                return;
            }

            const { role, Username, id } = result.data; // Extract user data from response

            // Login and store user info and role in context
            auth.login({ username: Username, id }, role);

            // Display success toast
            toast.success("Login successful");

            // Navigate based on role
            if (role === "admin") {
                navigate('/dashboard'); // Navigate to admin dashboard
            } else if (role === "employee") {
                navigate('/member'); // Navigate to member page for employee
            } else {
                toast.error("Unknown role");
            }
        } catch (error) {
            console.error(error);
            toast.error('Login failed: ' + error.message);
        }
    };

    return (
        <div className="user-auth">
            <ToastContainer />
            <form className="form" onSubmit={onSubmit}>
                <h1 className="heading">Login</h1>

                {/* Input field for username */}
                <input
                    type="text"
                    placeholder="Username"
                    className={`input ${username ? '' : 'error'}`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                {/* Input field for password */}
                <input
                    type="password"
                    placeholder="Password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Submit button */}
                <button className="btn" disabled={!username || !password}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
