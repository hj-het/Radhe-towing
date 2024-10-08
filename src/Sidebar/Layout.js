import React from "react";
import SidebarComponent from "./Sidebar";
import "./layout.css";
import Header from "../Header/Header";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <SidebarComponent /> 
      <div className="main-content">
        <Header/>
        {children} 
      </div>
    </div>
  );
};

export default Layout;
