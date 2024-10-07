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

function App() {
    return (
        <Router>
            <Routes>
                {/* Login page without sidebar */}
                <Route path="/" element={<Login />} />

                {/* Pages with sidebar */}
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/member" element={<Layout><Member /></Layout>} />
                <Route path="/employees" element={<Layout><Employees /></Layout>} />
                <Route path="/vehicle" element={<Layout><Vehicle /></Layout>} />
                <Route path="/plan" element={<Layout><Plan /></Layout>} />
                <Route path="/payment" element={<Layout><Payment /></Layout>} />
                <Route path="/service" element={<Layout><Service /></Layout>} />
                <Route path="/city" element={<Layout><City /></Layout>} />
                <Route path="/state" element={<Layout><State /></Layout>} />
                <Route path="/country" element={<Layout><Country /></Layout>} />
            </Routes>
        </Router>
    );
}

export default App;
