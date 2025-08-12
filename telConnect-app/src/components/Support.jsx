import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import '../styles/SupportPage.css';

const Support = () => {
  return (
    <section className="support-section">
      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="support-title">How Can We Help You?</h2>
            <p className="support-description">
              At TelConnect, we’re here to assist you with any issues or questions you may have. Let us know how we can help!
            </p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg={6}>
            <Form className="support-form">
              <Form.Group className="mb-4">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Issue</Form.Label>
                <Form.Control as="textarea" rows={5} placeholder="Describe your issue..." />
              </Form.Group>
              <Button className="support-button">Submit</Button>
            </Form>
          </Col>
        </Row>
        <Row className="contact-info mt-5">
          <Col lg={4} className="text-center">
            <h5>Call Us</h5>
            <p>1-800-123-4567</p>
          </Col>
          <Col lg={4} className="text-center">
            <h5>Email Us</h5>
            <p>telconnecta@gmail.com</p>
          </Col>
          <Col lg={4} className="text-center">
            <h5>Visit Us</h5>
            <p>123 Telecom Street, Tech City</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Support;