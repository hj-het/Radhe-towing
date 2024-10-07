import React from "react";
import { Sidebar, Menu, ProSidebarProvider } from "react-pro-sidebar";
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
import { AiOutlineTeam } from "react-icons/ai";
import "./../Sidebar/sidebar.css";

const SidebarComponent = () => {
  return (
    <ProSidebarProvider>
      <Sidebar
        backgroundColor="#2c3e50"
        style={{ height: "100vh", position: "fixed", top: 0, bottom: 0, zIndex: 1000 }}
      >
        <Menu>
          <ul className="sidebar-menu">
          <li>
              <Link to="/dashboard">
                <FaUsers /> Dasboard
              </Link>
            </li>

            <li>
              <Link to="/member">
                <FaUsers /> Members
              </Link>
            </li>
            <li>
              <Link to="/employees">
                <AiOutlineTeam /> Employees
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
        </Menu>
      </Sidebar>
    </ProSidebarProvider>
  );
};

export default SidebarComponent;
