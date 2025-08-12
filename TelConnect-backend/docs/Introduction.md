# TelConnect Backend

This is a backend application for providing telecom services. It comprises user onboarding, selection of service plans and activating service plans

## Features

- User registration and login with secure encryption of credentials.
- Browse and select service plans from list of plans.
- OCR implementation to read documents for customer verification
- Aadhaar verification of customers
- Map customers to their selected service plans.
- Admin approval of customer selected plans
- View and edit personal details.
- Send emails using MailJet for verification of Email.
- Push email upon plan selection and plan activation.
- Admin logs for viewing customer details.
- Swagger UI for API documentation.

## Technologies Used

- **Java** (JDK 17)
- **Spring Boot** (RESTful APIs)
- **Spring Security** (Authentication and Authorization)
- **Spring Data JPA** (Data Persistence)
- **MySQL** (Database)
- **JUnit** (Test cases)
- **Swagger-UI** (API Documentation)
- **MailJet** (3rd Party Mailing Service)

## Agile breakdown of Project
### **Epic 1: Customer Registration**
**User Story 1: Capture Customer Details**
- **As a** new customer,
- **I want** to enter my personal details (e.g., name, address, contact information),
- **So that** I can register for telecom services.

**User Story 2: Validate Customer Information**
- **As a** system,
- **I want** to validate the customer’s input (e.g., mandatory fields, email format, phone number),
- **So that** the information captured is accurate and complete.

**User Story 3: Store Customer Information**
- **As a** system,
- **I want** to save the validated customer information to the database,
- **So that** the customer’s registration is securely stored and retrievable.

### **Epic 2: Document Verification**
**User Story 4: Upload Customer Documents**
- **As a** registered customer,
- **I want** to upload my identification and address proof documents,
- **So that** my identity can be verified.

**User Story 5: Verify Uploaded Documents**
- **As a** system,
- **I want** to verify the uploaded documents using a third-party verification service,
- **So that** I can confirm the customer's identity and address.

**User Story 6:  Verification Status**
- **As a** customer,
- **I want** to instantly see the status of my document verification,
- **So that** I know if my documents have been approved or I need to resubmit the copy of aadhaar.

### **Epic 3: Service Activation**
**User Story 7: Select Telecom Service Plan**
- **As a** customer,
- **I want** to choose from a list of available telecom service plans,
- **So that** I can subscribe to the plan that best fits my needs.

**User Story 8: Activate Selected Service Plan**
- **As a** system,
- **I want** to activate the customer’s selected telecom service plan,
- **So that** they can start using the services.

**User Story 9: Send Service Activation Notification**
- **As a** customer,
- **I want** to receive a confirmation email when my service is activated,
- **So that** I know my telecom services are ready to use.

**User Story 10: Generate and Send Welcome Email**
- **As a** system,
- **I want** to automatically generate and send a welcome email after service activation,
- **So that** the customer feels welcomed and informed about their new services.

### **Epic 4: Account Management and Security**
**User Story 11: Update Personal Information**
- **As a** registered customer,
- **I want** to update my personal information (e.g., contact details),
- **So that** my account reflects my current details.

**User Story 12: Secure Account Access**
- **As a** customer,
- **I want** to securely log in to my account using a username and password,
- **So that** my personal information is protected.

### **Epic 6: Notifications and Communication**
**User Story 13: Email Verification**
- **As an** admin,
- **I want** push OTP to customer emails and automate this action,
- **So that** I can verify their emails.

**User Story 14: Access Customer Support**
- **As a** customer,
- **I want** to contact customer support for help with registration or service activation issues,
- **So that** I can resolve problems quickly.

