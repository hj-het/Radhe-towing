import React from "react";
import SidebarComponent from "./Sidebar";
import "./layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <SidebarComponent /> 
      <div className="main-content">
        {children} 
      </div>
    </div>
  );
};

export default Layout;
