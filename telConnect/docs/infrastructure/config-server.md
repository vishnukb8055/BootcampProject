
# Config Server Documentation

## Overview

The Config Server centralizes configuration management for all microservices in the application. It allows each service to retrieve its configuration data from a remote repository (Git) at startup.

---

## Requirements

- Centralize configuration for all services.
- Store all configuration files in a `config` repository.
- Each service will have a dedicated profile-based config file.

---

## Functionality

- All application `.yml` or `.properties` files are stored in a centralized config repo.
- A separate file (profile) is created for each microservice, containing its respective configuration data.

---

## Setup

### Configuration

1. **Add dependency** for Config Server.
2. **Enable Config Server** in the main class with:
   ```java
   @EnableConfigServer
   ```
3. **Specify the Git repository** from where the config files will be pulled.
   - If using a private repo, pass appropriate credentials.
   - Be cautious while passing auth tokens.

### Accessing Configs

- Config server is hosted on port `8888`.
- Services can access their config using:
  ```
  http://localhost:8888/{application-name}/{profile}
  ```
- You can also access specific properties or files.

---

## Runtime Behavior

- The microservice fetches config from the server **only once** during startup.
- Configuration is **stored in memory**.
- If the config server goes down after service startup, **services are not affected**.
- Refreshing the config won't work if the config server is down.

---

## Dynamic Refresh Support

- Use **Actuator** and set `@RefreshScope` on beans to enable runtime config refresh (requires config server to be up).
- You can refresh configuration without restarting the application.

---

## Eureka Integration

- Register Config Server with **Eureka Server**.
- Enables **dynamic discovery**, useful for scaling.

---

## Pros

- Centralized configuration.
- Easy environment management.
- Externalized config helps avoid hardcoding.
- Dynamic refresh support (with Spring Cloud Bus).
- No need to redeploy services for config changes.

---

## Cons

- If config server fails at boot time, services will not start.
- If dynamic refresh is needed and the server is down, changes won’t apply.
