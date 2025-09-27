# Part Pilot

#### Video Demo: [video link](https://www.loom.com/share/e98bbc08892345a8aff5bcf3fb136a97?sid=6c30c138-f572-4228-a400-f958bb3c992a)

## Description

Part Pilot is a robust, full-stack inventory management application designed to streamline the tracking, categorization, and management of automotive parts. Built with Node.js, Express, PostgreSQL, and EJS, it provides a secure, user-friendly interface for both administrators and regular users to manage parts, categories, car models, and trims. The application is designed for scalability, maintainability, and security, making it suitable for both small businesses and larger organizations with complex inventory needs.

The core motivation behind Part Pilot was to create an inventory system that is not only functional but also intuitive and secure. Many inventory systems are either too simplistic or overly complex; Part Pilot aims to strike a balance by offering essential features like authentication, role-based access, and detailed part categorization, while maintaining a clean and approachable user experience.

## Key Features

-   **User Authentication & Authorization:** Secure login and registration with Passport.js, supporting both regular users and admin roles. Admins have elevated privileges for managing users and inventory.
-   **Parts Management:** CRUD operations for automotive parts, including detailed attributes such as SKU, OEM number, brand, supplier, price, stock levels, and more.
-   **Category & Hierarchy:** Support for nested part categories, allowing for flexible organization of inventory.
-   **Car Models & Trims:** Manage car models and their associated trims, enabling precise mapping of parts to specific vehicles.
-   **Validation & Security:** Extensive input validation and sanitization, password hashing with PBKDF2, and session management with secure cookies.
-   **MVC Structure:** Clear separation of concerns using controllers, models, middleware, and routes for maintainability.

## File & Directory Overview

-   **app.js**: The main entry point of the application. Sets up Express, configures middleware, session management, Passport authentication, and registers all routers. Handles static files, view engine setup, and error handling.
-   **package.json**: Lists project dependencies, scripts, and metadata. Ensures reproducible builds and easy dependency management.
-   **config/pool.js**: Configures and exports the PostgreSQL connection pool using environment variables. Handles connection testing and error logging.
-   **config/passport.js**: Sets up Passport.js with the local strategy, serialization, and deserialization logic. Integrates with user model for authentication.
-   **middleware/auth.js**: Contains authentication and authorization middleware, including checks for logged-in users and admin privileges.
-   **middleware/locals.js**: Sets up common local variables for EJS templates, such as the current user and flash messages.
-   **middleware/validation.js**: Provides validation and sanitization middleware for user and part data, ensuring data integrity and security.
-   **lib/passwordUtils.js**: Utility functions for password hashing and validation using PBKDF2 and random salts.
-   **routes/userRouter.js**: Defines user-related routes for login, registration, profile management, and admin actions.
-   **routes/partRouter.js**: Handles part CRUD operations, with admin-only access for creation, editing, and deletion.
-   **routes/carModelRouter.js**: Manages car model CRUD operations, allowing users to view and manage vehicle models.
-   **routes/carTrimRouter.js**: Manages car trim CRUD operations, supporting detailed vehicle configuration.
-   **routes/partCategoryRouter.js**: Handles part category CRUD, supporting nested categories for flexible organization.
-   **controllers/**: Contains business logic for each resource (users, parts, categories, car models, trims). Controllers interact with models and handle request/response cycles.
-   **models/**: Defines database interaction logic for each resource, using parameterized queries to prevent SQL injection and ensure data consistency.
-   **public/**: Static assets such as CSS, images, and client-side JavaScript.
-   **views/**: EJS templates for rendering dynamic HTML pages.

## Design Choices & Rationale

-   **Security First:** User authentication is handled with Passport.js and PBKDF2 password hashing, ensuring that user credentials are never stored in plain text. Sessions are managed with secure cookies and stored in PostgreSQL for persistence and scalability.
-   **Role-Based Access Control:** By distinguishing between regular users and admins, the application ensures that only authorized personnel can perform sensitive operations like deleting parts or managing users. This is enforced through middleware.
-   **Validation & Sanitization:** All user input is validated and sanitized using express-validator, reducing the risk of injection attacks and data corruption. This is especially important for an inventory system where data integrity is critical.
-   **Modular Architecture:** The project is organized into clear modules (routes, controllers, models, middleware), making it easy to maintain, test, and extend. Each module has a single responsibility, following best practices for scalable Node.js applications.
-   **Database Abstraction:** All database interactions are handled in the models directory, using parameterized queries to prevent SQL injection. This abstraction allows for easier migration or extension to other databases in the future.
-   **User Experience:** The use of EJS templates and middleware for setting common locals ensures that users always have contextual information (like their login status) and receive clear feedback on their actions.
-   **Scalability:** By using a connection pool and storing sessions in the database, the application is ready for deployment in environments where multiple instances may be running.

## Getting Started

1. Clone the repository and install dependencies with `npm install`.
2. Set up a PostgreSQL database and configure environment variables in a `.env` file.
3. Run the application with `node app.js` or `npm start`.
4. Access the app in your browser at `http://localhost:3000`.

## Future Improvements

-   API endpoints for integration with other systems
-   Improved test coverage
-   Enhanced UI/UX with modern frontend frameworks
-   Inventory analytics and reporting

---

Part Pilot is designed to be a solid foundation for any organization needing reliable, secure, and flexible inventory management. Contributions and feedback are welcome!
