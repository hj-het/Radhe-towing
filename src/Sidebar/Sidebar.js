import React, { useContext } from "react";
import { Sidebar, Menu, ProSidebarProvider } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaCar,
  FaRegCreditCard,
  FaMoneyBillAlt,
  FaWrench,
  FaCity,
  // FaFlag,
  // FaGlobe,
} from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";
import { AuthContext } from "../Context/AuthContext"; 
import "./../Sidebar/sidebar.css";

const SidebarComponent = () => {
  const { role } = useContext(AuthContext); 

  return (
    <ProSidebarProvider>
      <Sidebar
        backgroundColor="#2c3e50"
        style={{
          height: "100vh",
          position: "fixed",
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <Menu>
          <ul className="sidebar-menu">
            <Link to="/dashboard">
              <li>
                <img
                  src="/images/radhe _logomain.png"
                  alt="Company Logo"
                  style={{ width: "251px", height: "65px" }}
                />
              </li>
            </Link>

            {/* Always show Dashboard, Members, Vehicles, Payments for employees and admin */}
            <li>
              <Link to="/dashboard">
                <FaUsers /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/member">
                <FaUsers /> Members
              </Link>
            </li>
            <li>
              <Link to="/vehicle">
                <FaCar /> Vehicles
              </Link>
            </li>
            <li>
              <Link to="/payment">
                <FaMoneyBillAlt /> Payments
              </Link>
            </li>

            {/* Show the following links only for admins */}
            {role === "admin" && (
              <>
                <li>
                  <Link to="/employees">
                    <AiOutlineTeam /> Employees
                  </Link>
                </li>
                <li>
                  <Link to="/plan">
                    <FaRegCreditCard /> Plans
                  </Link>
                </li>
                <li>
                  <Link to="/service">
                    <FaWrench /> Services
                  </Link>
                </li>
                {/* <li>
                  <Link to="/city">
                    <FaCity /> City
                  </Link>
                </li> */}
                {/* <li>
                  <Link to="/state">
                    <FaFlag /> State
                  </Link>
                </li>
                <li>
                  <Link to="/country">
                    <FaGlobe /> Country
                  </Link>
                </li> */}
              </>
            )}
          </ul>
        </Menu>
      </Sidebar>
    </ProSidebarProvider>
  );
};

export default SidebarComponent;
