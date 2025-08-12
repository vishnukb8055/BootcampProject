# Eureka Server Documentation

## Overview

The Eureka Server acts as a central service registry for all microservices in a Spring Boot microservices architecture. It enables service discovery and load balancing by allowing services to register themselves and discover others.

---

## Requirements

- Centralize service registry and discovery.
- Enable all services to register with a single Eureka server.

---

## Functionality

- All microservices are registered with the Eureka Server.
- Centralized registry enables service discovery and load balancing.
- Provides retry mechanisms in case of service failure.

---

## Setup

### Eureka Server

1. Add the dependency and use:
   ```java
   @EnableEurekaServer
   ```
2. Host the Eureka Server at port `8761`.

3. In the application configuration:
   ```properties
   eureka.client.register-with-eureka=false
   eureka.client.fetch-registry=false
   ```

   These settings prevent the server from registering or discovering itself.

---

## Client Configuration

- All services using Eureka must use:
  ```java
  @EnableEurekaClient (deprecated)
  @DiscoveryClient
  ```

- Add the following properties:
  ```properties
  eureka.client.service-url.defaultZone=http://localhost:8761/eureka
  ```

---

## Eureka Dashboard

- Access the dashboard at `http://localhost:8761/`.
- Provides information on:
  - Availability zones
  - Number of instances of each service
  - Health status of registered services

---

## Behavior

- All microservices are registered with their addresses.
- Load balancers can use this registry to route traffic.
- If Eureka Server goes down, it acts as a single point of failure.
- To prevent SPOF (Single Point of Failure):
  - Launch multiple instances in a peer-aware cluster.

---

## Mitigate SPOF and unexpected behaviour

- Self-preservation mode (enabled by default) helps in avoiding mass eviction during network glitches.
- Configure:
  ```properties
  eureka.server.enable-self-preservation=true
  ```

- Set renewal interval and eviction timeouts.
- Monitor Eureka endpoints for real-time health info.

---

## Edge Cases

- A new service starting during Eureka downtime won't be able to register or discover other services.
- Service discovery might fail if:
  - Service is not registered.
  - Eureka is unavailable.
