import React from "react";
import "../styles/ErrorPage.css"; // Ensure this is the correct path to your CSS file

const Error = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-image">
          <img src="src\assets\Image.jpg" alt="Error" />
        </div>
        <h1 className="error-title">404 Page Not Found</h1>
        <p className="error-message">We looked everywhere!</p>
        <p className="error-description">
          Looks like the page you are trying to find does not exist! In the
          meantime, you might want to check out our
          <a href="/" className="error-link">
            {" "}
            homepage
          </a>{" "}
          or contact
          <a href="/support" className="error-link">
            {" "}
            support
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Error;
