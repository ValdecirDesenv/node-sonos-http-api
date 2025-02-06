import React from "react";
import { Link } from "react-router-dom";
import { useWebSocketContext } from "../hooks/WebSocketProvider";
import { useEffect, useState } from "react";

interface Coordinator {
  roomName: string;
}

interface Group {
  data: { nameRoom: string; coordinator: Coordinator }[];
  devices: { [key: string]: string };
}

const Navbar: React.FC<{ group?: Group }> = ({ group }) => {
  const [devices, setDevices] = useState<{ uuid: string; roomName: string }[]>(
    []
  );

  useEffect(() => {
    if (group?.devices) {
      const deviceArray = Object.entries(group.devices).map(
        ([uuid, roomName]) => ({
          uuid,
          roomName,
        })
      );
      setDevices(deviceArray);
    }
  }, [group?.devices]);

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
                  {devices
                    .sort((a, b) => a.roomName.localeCompare(b.roomName))
                    .map((device, index) => (
                      <li className="listDevices" key={index}>
                        <Link
                          to={""}
                          className="listDevices"
                          // to={`/devices/${device.roomName}`}
                        >
                          {device.roomName}
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
