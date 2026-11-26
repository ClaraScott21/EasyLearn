# Easy Learn Spring Boot backend

This folder is reserved for the Spring Boot REST API. Use the MVC package layout under `src/main/java/com/easylearn`:

- `controller/` — REST endpoints and HTTP request/response handling
- `service/` — application rules and workflows
- `repository/` — Spring Data database access
- `entity/` — PostgreSQL-backed JPA entities
- `dto/request/` and `dto/response/` — API payloads
- `config/` — application and framework configuration
- `exception/` — shared API error handling
- `src/main/resources/` — configuration and backend resources
- `src/test/java/` — backend tests

The teammate implementing the API can add the Spring Boot Maven `pom.xml` and application entry point here when the backend work starts. PostgreSQL connection settings are documented in `application.properties.example`; copy values locally and keep credentials out of git.
