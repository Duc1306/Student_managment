
import React from "react";

function HustFooter() {
  return (
    <footer className="text-center py-3 mt-4 border-top">
      <small className="text-muted">
        © {new Date().getFullYear()} HUST - Bách Khoa 
      </small>
    </footer>
  );
}

export default HustFooter;
