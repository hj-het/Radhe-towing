import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import "./dashboard.css";
import {  AiOutlineDashboard } from "react-icons/ai";


const data = [
  { name: '1', uv: 2000, pv: 1000 },
  { name: '2', uv: 3000, pv: 1500 },
  { name: '3', uv: 4000, pv: 2000 },
  { name: '4', uv: 2500, pv: 1200 },
  { name: '5', uv: 3500, pv: 1800 },
  { name: '6', uv: 3000, pv: 1600 },
  { name: '7', uv: 4000, pv: 2200 },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 style={{display:"flex",textAlign:'center',gap:'6px'}}><AiOutlineDashboard/> Dashboard</h1>
      <div className="dashboard-content">
        {/* Sales Ratio Line Chart */}
        <div className="chart-container">
          <h3>Sales Ratio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="uv" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="pv" stroke="#93c5fd" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Referral Earnings and Users */}
        <div className="info-cards">
          <div className="info-card">
            <h3>Referral Earnings</h3>
            <h2>₹ 12,10,769.08</h2>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={data}>
                <Bar dataKey="pv" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="info-card">
            <h3>Number of Members</h3>
            <h2>35,658 <span className="growth">+23%</span></h2>
            <p>58% New Members</p>
            <p>42% Repeat Members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
