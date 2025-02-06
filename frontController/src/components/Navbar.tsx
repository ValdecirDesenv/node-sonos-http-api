import React from "react";
import { Link } from "react-router-dom";
import { useWebSocketContext } from "../hooks/WebSocketProvider";
import { useEffect, useState } from "react";

interface Coordinator {
  roomName: string;
}

interface Group {
  data: { nameRoom: string; coordinator: Coordinator }[];
}

const Navbar: React.FC<{ group?: Group }> = ({ group }) => {
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
              {group && (
                <ul className="nav flex-column">
                  {Object.values(group.data).map((device, index) => (
                    <li className="nav-item" key={index}>
                      <Link
                        className="nav-link"
                        to={`/devices/${device.coordinator.roomName}`}
                      >
                        {device.coordinator.roomName}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
