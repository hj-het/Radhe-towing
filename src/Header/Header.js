import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { AuthContext } from "../Context/AuthContext"; // Import AuthContext
import "./header.css"; // Import your custom CSS for the header

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout confirmation modal
  const dropdownRef = useRef(null); // Ref to detect outside click
  const { logout } = useContext(AuthContext); // Get logout function from AuthContext
  const navigate = useNavigate(); // Hook to navigate

  // Toggle the dropdown when clicking the profile picture
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close the dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false); // Close dropdown if clicked outside
    }
  };

  // Handle showing the logout confirmation modal
  const handleLogoutClick = () => {
    setShowLogoutModal(true); // Show confirmation modal
  };

  // Handle the actual logout process after confirmation
  const confirmLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/"); // Redirect to login page
    setShowLogoutModal(false); // Close the modal
  };

  // Close the modal without logging out
  const cancelLogout = () => {
    setShowLogoutModal(false); // Close the modal
  };

  // Add event listener for clicks when dropdown is open
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
          {/* Profile Section: clicking the img toggles the dropdown */}
          <div className="profile-section" onClick={toggleDropdown}>
            <img
              src="https://via.placeholder.com/40" // Replace with your profile pic
              alt="Profile"
              className="profile-pic"
            />
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <ul>
                <li>My Profile</li>
                <li>Change Password</li>
                <li onClick={handleLogoutClick}>Logout</li> {/* Handle logout click */}
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
    </>
  );
};

export default Header;
