import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="nav flex-column">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Sonos upcoming settings
        </Link>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link" to="/devices">
              Group Devices
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/settings">
              Settings 2
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
