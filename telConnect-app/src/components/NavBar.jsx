import React, { useState, useEffect, useContext } from "react";
import "../styles/NavBar.css";
// import logo from "../assets/logo.png";
// import search from "../assets/search.png";
import PersonIcon from "@mui/icons-material/Person";
import { Button, Stack } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom"; // Import useLocation
import { CustomerContext } from "../context/CustomerContext"; // Import the CustomerContext

const CustomButton = ({ label, isActive, onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      sx={{
        backgroundColor: isActive ? "#1E2A5A" : "#FFFFFF",
        color: isActive ? "#FFFFFF" : "#000000",
        borderRadius: "25px",
        textTransform: "none",
        fontWeight: "bold",
        padding: "6px 16px",
        border: isActive ? "none" : "1px solid #1E2A5A",
        "&:hover": {
          backgroundColor: isActive ? "#1E2A5A" : "#F0F0F0",
        },
      }}
      size="large"
    >
      {label}
    </Button>
  );
};

const ButtonGroup = () => {
  const location = useLocation(); // Get the current location
  const pathToButton = {
    "/home": "Home",
    "/servicePlans": "Services",
    "/recharge": "Recharge",
    "/support": "Support",
  };

  const currentPath = location.pathname;
  const activeButton = pathToButton[currentPath] || "Home"; // Set active button based on path

  return (
    <Stack direction="row" spacing={2}>
      <Link to="/home">
        <CustomButton label="Home" isActive={activeButton === "Home"} />
      </Link>
      <Link to="/servicePlans">
        <CustomButton label="Services" isActive={activeButton === "Services"} />
      </Link>
      {/* <CustomButton label="Recharge" isActive={activeButton === "Recharge"} /> */}
      <Link to="/support">
        <CustomButton label="Support" isActive={activeButton === "Support"} />
      </Link>
    </Stack>
  );
};

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { customerData } = useContext(CustomerContext); // Access the customerData from the context

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="navbar-container">
      <div
        className={`navbar-upper ${isScrolled ? "navbar-upper-hidden" : ""}`}
      >
        <Link to="/home">
          <img src='src\assets\logo.png' alt="Logo" className="logo" />
        </Link>
        <div className="search-login">
          <div className="search-box">
            <input type="text" placeholder="Search" />
            <img src='src\assets\search.png' alt="Search" className="search" />
          </div>
          {/* Conditionally change the Link based on login state */}
          <Link to={customerData ? "/profile" : "/login"}>
            <PersonIcon
              fontSize="large"
              className="loginicon"
              style={{ color: "#1E2A5A" }}
            />
          </Link>
        </div>
      </div>
      <div
        className={`navbar-lower ${isScrolled ? "navbar-lower-sticky" : ""}`}
      >
        <ButtonGroup />
      </div>
    </div>
  );
};

export default NavBar;
