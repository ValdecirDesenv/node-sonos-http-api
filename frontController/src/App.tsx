import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { WebSocketProvider } from "./hooks/WebSocketProvider";
import Devices from "./pages/Devices";
import Topbar from "./components/Topbar";

const App: React.FC = () => {
  return (
    <WebSocketProvider>
      <Router>
        <Topbar />

        <div className="d-flex">
          <Navbar />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </WebSocketProvider>
  );
};

export default App;
