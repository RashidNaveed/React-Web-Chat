import React from "react";
import "./Footer.css";

const Footer = () => {
  const copyRight = () => (
    <h2 variant="body2" color="textSecondary" align="center">
      {"Copyright @"}
      {"Rashid Naveed"}
      {new Date().getFullYear()}
      {"."}
    </h2>
  );
  return (
    <footer>
      <div className="footer 1-box is-center">{copyRight()}</div>
    </footer>
  );
};

export default Footer;
