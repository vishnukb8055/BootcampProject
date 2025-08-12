import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DocumentVerificationStatusLogs.css"; // Import the CSS file

// Define columns structure
const columns = [
  { id: "verificationId", label: "Verification ID", minWidth: 150 },
  { id: "customerId", label: "Customer ID", minWidth: 150 },
  { id: "documentId", label: "Document ID", minWidth: 150 },
  { id: "requestDate", label: "Request Date", minWidth: 200 },
  { id: "requestStatus", label: "Request Status", minWidth: 200 },
];

export default function DocumentVerificationStatusLogs() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("bearerToken");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}/admin/verificationAttempts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const mappedData = response.data.map((verification) => ({
          verificationId: verification.verificationId,
          customerId: verification.customerId,
          documentId: verification.documentId,
          requestDate: new Date(verification.requestDate).toLocaleString(),
          requestStatus: verification.requestStatus,
        }));
        setData(mappedData);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = data.filter((row) =>
    row.customerId.toString().includes(searchTerm)
  );

  // Function to determine status color
  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return "green";
      case "FAILED":
        return "red";
      default:
        return "black"; // Default color
    }
  };

  return (
    <div className="document-verification-container">
      <h1>Document Verification Logs</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by ID"
          onChange={handleSearchChange}
          value={searchTerm}
          className="search-input-doc"
        />
      </div>
      <table className="verification-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                style={{ minWidth: column.minWidth }}
                className="table-header-cell"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <tr key={row.verificationId}>
                {columns.map((column) => {
                  const value = row[column.id];
                  // Apply status color and uppercase transformation if column is 'requestStatus'
                  return (
                    <td
                      key={column.id}
                      className="table-body-cell"
                      style={{
                        color:
                          column.id === "requestStatus"
                            ? getStatusColor(value)
                            : "inherit",
                        textTransform:
                          column.id === "requestStatus" ? "uppercase" : "none",
                      }}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
