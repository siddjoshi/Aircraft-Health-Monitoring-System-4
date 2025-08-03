---
applyTo: '**/*.java'
---
<java_web_development>
When working with Java web applications, follow these specific guidelines:

1. **Framework Selection**: Prefer Spring Boot for modern Java web development unless the user specifies otherwise. Use Spring Boot 3.x with Java 17+ for new projects.

2. **Project Structure**: Follow Maven or Gradle conventions:
   - Use standard directory structure (src/main/java, src/main/resources, src/test/java)
   - Place controllers in appropriate packages (e.g., com.example.controller)
   - Use proper package naming conventions

3. **Dependencies**: Include necessary Spring Boot starters:
   - spring-boot-starter-web for REST APIs
   - spring-boot-starter-data-jpa for database access
   - spring-boot-starter-security for authentication (when needed)
   - spring-boot-starter-thymeleaf for server-side rendering

4. **Best Practices**:
   - Use annotations properly (@RestController, @Service, @Repository, @Component)
   - Implement proper exception handling with @ControllerAdvice
   - Use DTOs for API responses
   - Follow RESTful conventions for endpoints
   - Implement proper validation with @Valid

5. **Database**: Use H2 for development/testing, PostgreSQL for production unless specified otherwise.

6. **Testing**: Include unit tests with JUnit 5 and Mockito, integration tests with @SpringBootTest.

7. **Configuration**: Use application.properties or application.yml for configuration, with profiles for different environments.
</java_web_development>