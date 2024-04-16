import React, { useState } from "react";
import "./nav.css";
import { Link, NavLink } from "react-router-dom";

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
    <div className="title-container">
      <img src="\logo192.png" alt="Company Logo" className="logo" />
      <Link to="/Homepage" className="title">
        Falcon Print
      </Link>
    </div>
    <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <ul className={menuOpen ? "open" : ""}>
      <li>
        <NavLink to="/Homepage">Home</NavLink>
      </li>
      <li>
        <NavLink to="/FileManagement">File Uploading</NavLink>
      </li>
      <li>
        <NavLink to="/Accountpage">Account</NavLink>
      </li>
    </ul>
  </nav>
  
  );
};

export default NavBar;
