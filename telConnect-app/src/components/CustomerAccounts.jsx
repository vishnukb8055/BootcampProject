import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import "../styles/CustomerAccounts.css";

export default function CustomerAccounts() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const token = localStorage.getItem("bearerToken");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}/admin/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedData = response.data.map((customer) => ({
          customerId: customer.customerId,
          customerName: customer.customerName,
          customerEmail: customer.customerEmail,
          customerPhno: customer.customerPhno,
          customerAddress: customer.customerAddress,
          accountCreationDate: customer.accountCreationDate,
          customerDOB: customer.customerDOB,
        }));
        setData(fetchedData);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = (email) => {
    setSelectedEmail(email);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmail("");
  };

  const handleConfirmDelete = () => {
    axios
      .delete(
        `${baseUrl}/admin/customers/${encodeURIComponent(selectedEmail)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setData((prevData) =>
          prevData.filter((row) => row.customerEmail !== selectedEmail)
        );
        setSnackbarMessage("User deleted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleCloseDialog();
      })
      .catch((error) => {
        console.error("There was an error deleting the customer!", error);
        setSnackbarMessage("Error deleting user.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        handleCloseDialog();
      });
  };

  const filteredRows = data.filter(
    (row) =>
      row.customerId.toString().includes(searchTerm) ||
      row.customerEmail.includes(searchTerm)
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="dashboard-container">
      <h1>Customer Accounts</h1>
      <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
        <input
          type="text"
          placeholder="Search by ID"
          onChange={handleSearchChange}
          value={searchTerm}
          className="search-input-cust"
        />
      </Box>
      <table className="customer-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Account Creation Date</th>
            <th>Date of Birth</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.length > 0 ? (
            filteredRows
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <tr key={row.customerId}>
                  <td>{row.customerId}</td>
                  <td>{row.customerName}</td>
                  <td>{row.customerEmail}</td>
                  <td>{row.customerPhno}</td>
                  <td>{row.customerAddress}</td>
                  <td>{row.accountCreationDate}</td>
                  <td>{row.customerDOB}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(row.customerEmail)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent className="dialog-content">
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions className="dialog-actions">
          <button onClick={handleCloseDialog} className="delete-button">
            Cancel
          </button>
          <button onClick={handleConfirmDelete} className="delete-button">
            Delete
          </button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        action={
          <Button className="snackbar-button" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
