import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import "../styles/ProfilePage.css";
import { CustomerContext } from "../context/CustomerContext";
import { useNavigate } from "react-router-dom";
import { isDocumentVerified } from "../utils/authutils";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EditProfileModal from "./EditProfileModal";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentVerified, setDocumentVerified] = useState(false);
  const { customerData: contextCustomerData, logout } =
    useContext(CustomerContext);
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(contextCustomerData);
  const [showModal, setShowModal] = useState(false);

  const [activePlan, setActivePlan] = useState(null); // State for storing active plan details
  const [planLoading, setPlanLoading] = useState(true); // Loading state for the plan

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/customers/${contextCustomerData.customerEmail}`,
          { withCredentials: true }
        );
        setCustomerData(response.data);

        const verified = await isDocumentVerified(response.data.customerId);
        setDocumentVerified(verified);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (contextCustomerData) {
      fetchCustomerData();
    } else {
      setLoading(false);
    }
  }, [contextCustomerData]);

  // Fetch active plan details
  useEffect(() => {
    const fetchActivePlan = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/customers/plans/${contextCustomerData.customerId}/status`,
          { withCredentials: true }
        );
        // console.log(response.data);
        response.data.forEach((plan) => {
          if (plan.status === "Active") {
            setActivePlan(plan);
            // console.log(plan);
          }
        });
      } catch (err) {
        console.error("Error fetching active plan:", err);
        setActivePlan(null);
      } finally {
        setPlanLoading(false);
      }
    };

    if (contextCustomerData) {
      fetchActivePlan();
    }
  }, [contextCustomerData]);

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  useEffect(() => {
    // console.log("Active plan:", activePlan); // This will log whenever activePlan changes
  }, [activePlan]);

  const redirectToDocumentVerification = () => {
    navigate("/documentVerification", { state: { fromProfile: true } });
  };

  const handleUpdateCustomerData = async (updatedData) => {
    try {
      await axios.patch(
        `${baseUrl}/customers/${contextCustomerData.customerEmail}`,
        updatedData,
        { withCredentials: true }
      );
      setCustomerData(updatedData);
    } catch (err) {
      console.error("Error updating customer data:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  if (!customerData) {
    return <div>No customer data found.</div>;
  }

  return (
    <div className="profile-active-plans-container">
      <section className="profile-section">
        <Container className="py-5 container">
          <Row className="d-flex justify-content-center align-items-center h-100">
            <Col lg={8}>
              <Card className="profile-card">
                <Card.Header className="profile-card-header d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <AccountCircleIcon
                      style={{ fontSize: "6rem" }}
                      className="profile-icon"
                    />
                    <div className="d-flex flex-column">
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0">{customerData.customerName}</h5>
                        <Button
                          variant="link"
                          className="edit-button-profile"
                          onClick={() => setShowModal(true)}
                        >
                          <EditRoundedIcon />
                        </Button>
                      </div>
                      <p>{customerData.role}</p>
                    </div>
                  </div>
                  <Button className="logout-button" onClick={handleLogout}>
                    <LogoutIcon />
                    Logout
                  </Button>
                </Card.Header>
                <Card.Body className="profile-card-body">
                  <hr />
                  <Row className="pt-1">
                    <Col xs={6} className="mb-3">
                      <h6>Email</h6>
                      <p className="text-muted">{customerData.customerEmail}</p>
                    </Col>
                    <Col xs={6} className="mb-3">
                      <h6>Phone</h6>
                      <p className="text-muted">{customerData.customerPhno}</p>
                    </Col>
                  </Row>

                  <h6>Document Verification Status</h6>
                  <hr />
                  <Row className="pt-1">
                    <Col xs={12} className="mb-3">
                      {documentVerified ? (
                        <div className="text-success">
                          <CheckCircleIcon style={{ fontSize: "2rem" }} />
                          Document Verified
                        </div>
                      ) : (
                        <div className="text-danger">
                          <ErrorIcon style={{ fontSize: "2rem" }} />
                          <p>Your documents are not verified.</p>
                          <Button
                            onClick={redirectToDocumentVerification}
                            className="mt-2"
                          >
                            Verify Documents
                          </Button>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <h6>Address</h6>
                  <hr />
                  <Row className="pt-1">
                    <Col xs={12} className="mb-3">
                      <p className="text-muted">
                        {customerData.customerAddress}
                      </p>
                    </Col>
                  </Row>
                  <h6>Date of Birth</h6>
                  <hr />
                  <Row className="pt-1">
                    <Col xs={12} className="mb-3">
                      <p className="text-muted">{customerData.customerDOB}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Active Plan Section */}

          <Row className="d-flex justify-content-center align-items-center h-100 active-plan">
            <Col lg={8}>
              <Card className="active-plan-card">
                <Card.Header className="profile-card-header d-flex justify-content-between align-items-center">
                  <h5>Active Service Plans</h5>
                </Card.Header>
                <Card.Body className="active-plan-card-body">
                  {planLoading ? (
                    <div>Loading plan details...</div>
                  ) : activePlan && true ? (
                    <div>
                      <p>
                        <strong>Plan:</strong> {activePlan?.planId}
                      </p>
                      <p>
                        <strong>Status:</strong> {activePlan?.status}
                      </p>
                      <p>
                        <strong>Start Date:</strong> {activePlan?.startDate}
                      </p>
                      <p>
                        <strong>End Date:</strong> {activePlan?.endDate}
                      </p>
                    </div>
                  ) : (
                    <div>No existing plans</div>
                  )}
                  {/* Image Column */}
                  <div className="ml-auto">
                    <img
                      src="src\assets\connected-img.jpg"
                      alt="Plan illustration"
                      className="img-fluid"
                      style={{ maxHeight: "200px", marginLeft: "20px" }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Edit Profile Modal */}
      <EditProfileModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        customerData={customerData}
        updateCustomerData={handleUpdateCustomerData}
      />
    </div>
  );
};

export default Profile;
