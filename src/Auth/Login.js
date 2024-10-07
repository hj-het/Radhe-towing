import React, { useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "./../Auth/user-auth.css";

const Login = () => {
    const auth = useContext(AuthContext);
    const [username, setUsername] = useState(""); // Username input only
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            username,
            password,
        };

        try {
            const response = await axios.post('https://dev.finnovationz.com:3250/api/admin/login', payload);
            const user = response.data.data.user; // User info

            if (!user) {
                toast.error("Invalid login credentials");
                return;
            }

            // Login and store user info and role in context
            const userRole = user.role; // Assuming 'role' is part of user data (either 'Admin' or 'Employee')
            auth.login(user, userRole);

            // Display success toast
            toast.success("Login successful");

            // Navigate based on user role
            if (userRole === "Admin") {
                navigate('/admin/dashboard'); // Navigate to admin dashboard
            } else if (userRole === "Employee") {
                navigate('/employee/dashboard'); // Navigate to employee dashboard
            } else {
                toast.error("Unknown role");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error('Login failed: ' + (error.response?.data?.message || error.message));
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="user-auth">
            <ToastContainer />
            <form className="form" onSubmit={onSubmit}>
                <h1 className="heading">Login</h1>

                {/* Single input field for username */}
                <input
                    type="text"
                    placeholder="Username"
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

                <button className="btn" disabled={!username || !password}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
