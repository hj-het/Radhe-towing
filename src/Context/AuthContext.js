import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user information
    const [role, setRole] = useState(null); // Store user role

    // Login function that stores user and role
    const login = (userData, userRole) => {
        setUser(userData);
        setRole(userRole);
        localStorage.setItem('user', JSON.stringify(userData)); // Optionally store user data in local storage
        localStorage.setItem('role', userRole); // Optionally store role in local storage
    };

    // Logout function that clears user and role
    const logout = () => {
        setUser(null);
        setRole(null);
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        // You can handle navigation after logout in the component that calls this
    };

    // Load the user and role from local storage when the app loads (optional, for persistence)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');
        if (storedUser && storedRole) {
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
