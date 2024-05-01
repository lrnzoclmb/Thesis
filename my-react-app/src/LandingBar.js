import React, { useState } from "react";
import "./nav.css";
import { Link, NavLink } from "react-router-dom";

export const LandingBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
    <div className="title-container">
      <img src="\logo192.png" alt="Company Logo" className="logo" />
      <Link to="/" className="title">
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
        <NavLink to="/FileHome">File Uploading</NavLink>
      </li>
      <li>
        <NavLink to="/login">Login</NavLink>
      </li>
    </ul>
  </nav>
  
  );
};

export default LandingBar;
