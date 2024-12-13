import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import "./header.css";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const role = localStorage.getItem("role") || "Guest"; // Fetch role separately
  const username = userData?.username || "Guest";

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/");
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      <header className="header">
        <div className="header-left">
          {/* <input type="text" placeholder="Search" className="search-input" /> */}
        </div>

        <div className="header-right">
          <div className="profile-section" onClick={toggleDropdown}>
            <span className="username">Hello {username},</span>
            <img
              src={role === "admin" ? "/images/admin.png" : "/images/user.png"}
              alt="Profile"
              className="profile-pic"
            />
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <ul>
                <li onClick={handleProfileClick}>My Profile</li>
                <li onClick={handleLogoutClick}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button className="btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay-profile">
          <div className="modal-content-profile">
            <h3>My Profile</h3>
            <ul>
              {Object.entries(userData).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {JSON.stringify(value)}
                </li>
              ))}
              <li>
                <strong>Role:</strong> {role}
              </li>
            </ul>
            <button className="btn-close-profile" onClick={closeProfileModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
