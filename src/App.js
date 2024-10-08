import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dasboard/Dashboard';
import Plan from './Components/Plan';
import Payment from './Components/Payment';
import Service from './Components/Service';
import City from './Components/City';
import State from './Components/State';
import Country from './Components/Country';
import Member from './Components/Member';
import Employees from './Components/Employees';
import Vehicle from './Components/Vehicle';
import Login from './Auth/Login';
import Layout from './Sidebar/Layout';
import { AuthProvider } from './Context/AuthContext'; // Import AuthProvider
import ProtectedRoute from './Context/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Login page without sidebar */}
                    <Route path="/" element={<Login />} />

                    {/* Pages accessible to both admin and employee */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'employee']}>
                                <Layout><Dashboard /></Layout>
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/member" 
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'employee']}>
                                <Layout><Member /></Layout>
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/vehicle" 
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'employee']}>
                                <Layout><Vehicle /></Layout>
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/payment" 
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'employee']}>
                                <Layout><Payment /></Layout>
                            </ProtectedRoute>
                        } 
                    />

                    {/* Pages accessible only to admin */}
                    <Route 
                        path="/employees" 
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><Employees /></Layout>
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/plan" 
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><Plan /></Layout>
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/service" 
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><Service /></Layout>
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/city" 
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><City /></Layout>
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/state" 
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><State /></Layout>
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/country" 
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><Country /></Layout>
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
