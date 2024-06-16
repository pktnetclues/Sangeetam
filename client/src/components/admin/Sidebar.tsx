import React from "react";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Admin Dashboard</h3>
      </div>
      <div className="sidebar-content">
        <ul>
          <li>
            <a href="#">Dashboard</a>
          </li>
          <li>
            <a href="#">Users</a>
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
          <li>
            <a href="#">Help</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
