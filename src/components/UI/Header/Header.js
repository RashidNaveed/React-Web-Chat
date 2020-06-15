import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { Link } from "react-scroll";

const Header = () => {
  return (
    <header className="header-login-signup">
      <div className="header-limiter">
        <h1>
          <a href="/">
            {" "}
            Web<span>Chat</span>
          </a>
        </h1>
        <nav>
          <NavLink to="/" className="selected">
            Home
          </NavLink>
          <Link to="about-us" spy={true} smooth={true} duration={500}>
            About Me
          </Link>
          <Link to="contact-us" spy={true} smooth={true} duration={500}>
            Contact Me
          </Link>
        </nav>
        <ul>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          <li>
            <NavLink to="/signup">Signup</NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
