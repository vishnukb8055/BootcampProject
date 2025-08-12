
# API Gateway Documentation

## Requirements

- Create a gateway to handle and route traffic to services.

---

## Functionalities

- Handles all requests and routes them to services.
- Handles security features.
- Handles load balancing with Ribbon.
- Caching of some responses.
- Circuit breaking.
- Rate limiting.

---

## Data

- Stores all the URIs of the endpoints for all services.

## Core Functionality

- The main functionality is to route all incoming requests to the appropriate services.
- Can define static routes or dynamic routes using Eureka server for service discovery.

---

## Security and Filters

- Configure security filters for endpoints and respective request headers.
- Configure JWT and OAuth2 for authentication.
- Enable CORS configuration.

---

## Load Balancing and Optimization

- Helps in setting up load balancing, rate limiting, and caching of frequently queried requests.

## Monitoring and Tracing

- Integrate Sleuth and Zipkin for monitoring and health checks using Actuator.

---
## Configuration

The application.properties are pulled from the config-server hosted at localhost:8888

### Config Client

- The old version of config client used bootstrap.yml in the application, this is deprecated now so use the regular application.yml
- The app.yml file will have the following key details:
  1. spring.application.name (name of the config file that will be looked up)
  2. spring.profiles.active (the profile to be used eg. dev, prod, test)
  3. spring.label (branch of the config repo)
  4. spring.config.import: configserver: {URI of the configserver}

---
## Considerations

- Keep the gateway stateless; avoid storing session information.
- Avoid placing business logic in filters.
- The gateway can become a Single Point of Failure (SPOF) since it is the main entry point to the application.
- Make the gateway highly available by launching multiple instances.
- There may be additional latency as requests go through an extra layer.
