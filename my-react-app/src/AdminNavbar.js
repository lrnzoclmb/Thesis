import React, { useState } from "react";
import "./nav.css";
import { Link, NavLink } from "react-router-dom";

export const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
    <div className="title-container">
      <img src="\logo192.png" alt="Company Logo" className="logo" />
      <Link to="/admin" className="title">
        Falcon Print Admin
      </Link>
    </div>
    <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <ul className={menuOpen ? "open" : ""}>
      <li>
        <NavLink to="/AdminPage">Transactions</NavLink>
      </li>
      <li>
        <NavLink to="/AdminUsers">UserAccounts</NavLink>
      </li>
    </ul>
  </nav>
  
  );
};

export default AdminNavbar;
