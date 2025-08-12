import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import '../styles/TermsOfService.css';

const TermsOfService = () => {
  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} className="terms-paper">
        <Typography variant="h4" className="terms-title">
          Terms of Service
        </Typography>
        <Typography variant="body1" className="terms-content">
          <h4>Introduction</h4>
          <p>
            Welcome to TelConnect. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our services, you agree to comply with these Terms.
          </p>
          
          <h4>Services Provided</h4>
          <p>
            TelConnect provides telecommunications services, including but not limited to voice, data, and messaging services. We may update or modify our services from time to time.
          </p>

          <h4>Account Responsibility</h4>
          <p>
            You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.
          </p>

          <h4>Prohibited Conduct</h4>
          <p>
            You agree not to use our services for any unlawful or prohibited activities. This includes, but is not limited to, transmitting harmful or offensive content, engaging in fraudulent activities, and violating intellectual property rights.
          </p>

          <h4>Service Interruptions</h4>
          <p>
            We strive to provide continuous and reliable service, but there may be interruptions due to maintenance, technical issues, or other factors beyond our control. We will make reasonable efforts to minimize service disruptions.
          </p>

          <h4>Limitation of Liability</h4>
          <p>
            TelConnect is not liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services. Our liability is limited to the maximum extent permitted by law.
          </p>

          <h4>Changes to Terms</h4>
          <p>
            We may update these Terms from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of our services after any changes indicates your acceptance of the updated Terms.
          </p>

          <h4>Governing Law</h4>
          <p>
            These Terms are governed by and construed in accordance with the laws of the jurisdiction in which TelConnect operates. Any disputes arising under these Terms will be subject to the exclusive jurisdiction of the courts in that jurisdiction.
          </p>

          <h4>Contact Us</h4>
          <p>
            If you have any questions or concerns about these Terms of Service, please contact us at <a href="mailto:support@telconnect.com">support@telconnect.com</a>.
          </p>
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsOfService;
