import React from "react";

const LoaderIcon: React.FC = () => {
  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <div className="loader">
        <div className="dot white"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default LoaderIcon;
