// Sidebar.js
import React, { useState } from "react";
import Sidebar from "react-sidebar";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaCar,
  FaRegCreditCard,
  FaMoneyBillAlt,
  FaWrench,
  FaCity,
  FaFlag,
  FaGlobe,
} from "react-icons/fa";
import "./../Sidebar/sidebar.css";

const SidebarComponent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);


  const sidebarContent = (
    <div className="sidebar-content ">
      <ul>
        <li>
          <Link to="/member">
            <FaUsers /> Members
          </Link>
        </li>
        <li>
          <Link to="/employees">
            <FaUsers /> Employees
          </Link>
        </li>
        <li>
          <Link to="/vehicle">
            <FaCar /> Vehicles
          </Link>
        </li>
        <li>
          <Link to="/plan">
            <FaRegCreditCard /> Plans
          </Link>
        </li>
        <li>
          <Link to="/payment">
            <FaMoneyBillAlt /> Payments
          </Link>
        </li>
        <li>
          <Link to="/service">
            <FaWrench /> Services
          </Link>
        </li>
        <li>
          <Link to="/city">
            <FaCity /> City
          </Link>
        </li>
        <li>
          <Link to="/state">
            <FaFlag /> State
          </Link>
        </li>
        <li>
          <Link to="/country">
            <FaGlobe /> Country
          </Link>
        </li>
      </ul>
    </div>
  );

  return (
    <div>
      {/* <button className="toggle-button" onClick={toggleSidebar}>
        {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      </button> */}

      <Sidebar
        sidebar={sidebarContent}
        open={sidebarOpen}
        onSetOpen={setSidebarOpen}
        styles={{
          root: { position: "relative" }, 
          sidebar: {
            background: "#2c3e50",
            width: "250px",
            color: "#fff",
            position: "fixed", 
            top: "0",
            bottom: "0",
            zIndex: 1000, 
          },
          overlay: {
            
          
          },
          content: {
            position: "relative",
            overflow: "auto",
          },
        }}
      ></Sidebar>
    </div>
  );
};

export default SidebarComponent;
