
import React from "react";

function HustHeader({ title, subtitle, icon }) {
  return (
    <div className="mb-3 p-3 bg-light border rounded-3 d-flex align-items-center">
      {icon && <i className={`bi bi-${icon} fs-3 me-3 text-danger`}></i>}
      <div>
        <h4 className="mb-0">{title}</h4>
        {subtitle && <small className="text-muted">{subtitle}</small>}
      </div>
    </div>
  );
}

export default HustHeader;
