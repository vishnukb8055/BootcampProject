import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import '../styles/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className='privacy-policy-container'>
    <Container component="main" maxWidth="md">
      <Paper elevation={3} className="privacy-paper">
        <Typography variant="h4" className="privacy-title">
          Privacy Policy
        </Typography>
        <Typography variant="body1" className="privacy-content">
          <h4>Introduction</h4>
          <p>
            At TelConnect, we are committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>
          
          <h4>Information We Collect</h4>
          <p>
            We collect personal information that you provide to us directly, such as your name, email address, and contact details. We may also collect information automatically through your use of our services, including usage data and device information.
          </p>

          <h4>How We Use Your Information</h4>
          <p>
            We use your information to provide, maintain, and improve our services. This includes processing your transactions, communicating with you about your account, and personalizing your experience.
          </p>

          <h4>Data Security</h4>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h4>Cookies and Tracking Technologies</h4>
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our website. You can manage your cookie preferences through your browser settings.
          </p>

          <h4>Third-Party Services</h4>
          <p>
            We may share your information with third-party service providers who assist us in operating our website and services. These third parties are obligated to protect your information and use it only for the purposes specified by us.
          </p>

          <h4>Your Rights</h4>
          <p>
            You have the right to access, correct, or delete your personal information. You may also object to the processing of your data or request that we restrict its use.
          </p>

          <h4>Changes to This Privacy Policy</h4>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
          </p>

          <h4>Contact Us</h4>
          <p>
            If you have any questions or concerns about this Privacy Policy or our practices, please contact us at <a href="mailto:telconnecta@gmail.com">telconnecta@gmail.com</a>.
          </p>
        </Typography>
      </Paper>
    </Container>
    </div>
  );
};

export default PrivacyPolicy;
