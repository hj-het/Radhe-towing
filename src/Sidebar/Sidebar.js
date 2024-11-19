import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaCar,
  FaRegCreditCard,
  FaMoneyBillAlt,
  FaWrench,
  FaUserTie 
} from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { AuthContext } from "../Context/AuthContext";
import "./../Sidebar/sidebar.css";

const SidebarComponent = () => {
  const { role } = useContext(AuthContext);

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <NavLink to="/dashboard">
          <img
            src="/images/radhe _logomain.png"
            alt="Company Logo"
            style={{ width: "201px", height: "55px" }}
          />
        </NavLink>
      </div>

      <ul className="sidebar-menu">
        {/* Always show Dashboard, Members, Vehicles, Payments for employees and admin */}
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <AiOutlineDashboard className="sidebar-icon" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/member"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <FaUsers className="sidebar-icon" /> Members
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/vehicle"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <FaCar className="sidebar-icon" /> Vehicles
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/payment"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <FaMoneyBillAlt className="sidebar-icon" /> Payments
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/service"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <FaWrench className="sidebar-icon" /> Services
          </NavLink>
        </li>

        {/* Show the following links only for admins */}
        {role === "admin" && (
          <>
            <li>
              <NavLink
                to="/employees"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                <FaUserTie className="sidebar-icon" /> Employees
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/plan"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                <FaRegCreditCard className="sidebar-icon" /> Plans
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SidebarComponent;
