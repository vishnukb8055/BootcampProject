# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v3.0.0] - 04-08-2025

### Added
- Added tesseract-OCR packages as zip file
- Included exception handling for expired JWT token (simple try catch can be picked up from console for admin logging)
- Enabled actuator endpoints for health monitoring, can be accessed by admin


### Changed
- Updated gitignore file with Tesseract-OCR, check docs for usage 
- Updated certain email endpoints and OCR endpoint to require JWT auth
- Modified customer service to disallow operations on admin account
- Modified endpoints to handle error conditions and throw appropriate status codes
- Changed the return type of data in verification status and notification endpoint
- Updated tests for notification and verification


### Removed
- Removed functional tests from EmailServiceTests


## [v2.3.0] - 25-07-2025

### Added
- Integration with vault for retrieving secrets and database password
- VaultConfig commands in doc


### Changed
- Updated email service to pull api-keys from vault for pushing email
- Updated application.properties to retrieve database credentials from vault during application bootup


## [v2.2.0] - 21-07-2025

### Changed
- Removed the springcloud dependency, not using for now
- Updated model classes for customerPlansMapping, Document, Notification, and Verification. Now the referenced columns are bound by foreign key, initially they just shared a name with extra logic to keep them in sync
- Removed cascading in customer model
- Updated the respective services of the model classes to accommodate the change in the model schema
- Removed unused code and extra comments
- Refactored all the test cases for all the services based on the changes made to the service and model schema
- Added custom JPQL queries for Document, Verification and Notification repositories

## [v2.1.0] - 11-07-2025

### Added
- Tags to controller endpoints for better API documentation


### Changed
- Removed the deprecated modules from JwtTokenProvider, SpringSecurityConfig and EmailService
- Upgraded springboot version from 3.3.2 -> 3.5.3
- Upgraded junit version from 5.10.2 -> 5.13.3

## [v2.0.0] - 10-07-2025

### Added
- JWT authentication and authorization for customer users
- Roles table with the roles for admin and users
- User_roles mapping to automatically map new customers with user roles upon registration

### Changed
- Modified all service APIs to use JWT auth, some require admin role to be accessed(introduced RBAC)
- Updated security filters chain to protect API endpoints with JWT, reduced the permitAll() usage
- Updated the JWT authentication flow, removed the existing custom auth flow and integrated spring security for auth
- Updated adminController and moved away from a mega controller calling all the services and moved the endpoints to their respective controllers with RBAC @PreAuthorize(ADMIN)

## [v1.0.0] - 27-06-2025

### Added
Initial release with all the basic functionalities
