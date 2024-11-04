import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaCar,
  FaRegCreditCard,
  FaMoneyBillAlt,
  FaWrench,
} from "react-icons/fa";
import { MdCardMembership } from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
import { AuthContext } from "../Context/AuthContext"; 
import "./../Sidebar/sidebar.css";

const SidebarComponent = () => {
  const { role } = useContext(AuthContext);

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <Link to="/dashboard">
          <img
            src="/images/radhe _logomain.png"
            alt="Company Logo"
            style={{ width: "201px", height: "55px" }}
          />
        </Link>
      </div>

      <ul className="sidebar-menu">
        {/* Always show Dashboard, Members, Vehicles, Payments for employees and admin */}
        <li>
          <Link to="/dashboard" className="sidebar-link">
            <FaUsers className="sidebar-icon" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/member" className="sidebar-link">
            <MdCardMembership className="sidebar-icon" /> Members
          </Link>
        </li>
        <li>
          <Link to="/vehicle" className="sidebar-link">
            <FaCar className="sidebar-icon" /> Vehicles
          </Link>
        </li>
        <li>
          <Link to="/payment" className="sidebar-link">
            <FaMoneyBillAlt className="sidebar-icon" /> Payments
          </Link>
        </li>

        {/* Show the following links only for admins */}
        {role === "admin" && (
          <>
            <li>
              <Link to="/employees" className="sidebar-link">
                <AiOutlineTeam className="sidebar-icon" /> Employees
              </Link>
            </li>
            <li>
              <Link to="/plan" className="sidebar-link">
                <FaRegCreditCard className="sidebar-icon" /> Plans
              </Link>
            </li>
            <li>
              <Link to="/service" className="sidebar-link">
                <FaWrench className="sidebar-icon" /> Services
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SidebarComponent;
