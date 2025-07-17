CRM Dashboard – Java Spring Boot Project
This is a basic CRM Dashboard Web Application built for an admin user, where the admin can manage users and their associated contacts, 
and view simple reports like contact count per user and most recently added contacts.

Tech Stack -
Backend - Java 17, Spring Boot 3, Spring Data JPA,MySQL,Lombok
Frontend - HTML5, CSS3, JavaScript
Bootstrap 5 - for quick, responsive UI design

Project Structure -
Follows layered architecture:
Controller layer – handles HTTP requests
Service layer – contains business logic
Repository layer – interacts with the database
Model – defines entities: User and Contact

Features Implemented -
Login Page (Hardcoded credentials).
User Management (Create, View, Update, Delete users).
Contact Management (CRUD + search contacts by name/email).
Reporting  - Count of contacts per user and 5 most recently added contacts.
Integrated MySQL Database wuth Fully working frontend pages for login, dashboard, user, contact, and reporting.
Tested all the APIs of User, Contact and Reporting by myself first through postman in order to see everything is working fine.

Architectural Choices -
Spring Boot was chosen for its ease of setup, embedded server, and REST API capabilities.
Spring Data JPA simplifies database interaction and helps with object-relational mapping.
Bootstrap was used to quickly style pages responsively without writing CSS from scratch.
The relationship between User and Contact was designed as Many-to-One to represent each contact belonging to a user.
Data fetch was done using fetch() and DOM manipulation for dynamic behavior.

Challenges & Resolutions -
1. Establishing ManyToOne relationship between Contact and User, Used @ManyToOne with proper @JoinColumn and ensured only userId is passed from frontend.
2. Contact object showing null User attributes Fixed by retrieving full User entity from DB before saving.
3. Static assets not loading, Placed images and CSS under (src/main/resources/static) and referenced paths correctly.
4. JS not executing inside dynamically loaded HTML, Moved logic into dashboard.js and loaded HTML + scripts dynamically.

Setup Instructions (Run Locally) -
Prerequisites - Java 17+, Maven, MySQL, Git

Configure Database -
Create a MySQL database name as crm_dashboard

Update application.properties -
spring.datasource.username=your_username generally it is (root)
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update (please dont change update to create or any other value)

Run the Spring Boot App - ./mvnw spring-boot:run

Access Frontend - Go to browser in the url bar navigate to this path http://localhost:8080/index.html

Login credentails - Username: admin, Password: password (dont do with anything else, orelse it will not work, as it is hardcoded).

Thank You,
Ronit Dalal.
