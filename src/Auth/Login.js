import React, { useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
// import styles from './user-auth.module.css';  
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom'; // For navigation
import "./../Auth/user-auth.css"

const Login = () => {
    const auth = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;


    const isValidEmail = () => {
        if (!email) return true;
        return emailRegex.test(email);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
           console.log("Api data")
        const payload = { email, password };

        try {
            const response = await axios.post('https://dev.finnovationz.com:3250/api/admin/login', payload);
            const authToken = response.data.data.authToken;

            if (!authToken) {
                toast.error("Invalid login credentials");
                return;
            }

           
            auth.login(response.data.data.user); 

            toast.success("Login successful");
            navigate('/dashboard');  
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

                
                <input
                    type="text"
                    placeholder="Email"
                    className={`input ${isValidEmail() ? '' : 'error'}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                
                <input
                    type="password"
                    placeholder="Password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

               
                <button className="btn" disabled={!email || !password}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
