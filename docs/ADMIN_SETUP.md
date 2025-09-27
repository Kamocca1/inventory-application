# Admin User Setup Guide

## Overview

This application uses a Super Admin approach for managing admin privileges:

-   Only existing admin users can grant admin privileges to other users
-   The first admin user must be created using the provided script
-   Admin privileges are controlled through middleware that checks user permissions

## Creating the First Admin User

### Step 1: Set up the database

Make sure your database is running and the schema has been applied:

```bash
# Apply the database schema
psql -d your_database_name -f db/schema.sql
```

### Step 2: Create the first admin user

Use the provided script to create your first admin user:

```bash
node scripts/createAdmin.js <username> <firstName> <lastName> <email> <password>
```

Example:

```bash
node scripts/createAdmin.js admin John Doe admin@company.com SecurePassword123
```

## Admin Privileges

### What Admins Can Do

-   View all users
-   Create new users (with or without admin privileges)
-   Update any user's information
-   Grant or revoke admin privileges for other users
-   Delete users

### What Regular Users Can Do

-   View their own profile
-   Update their own information (except admin status)
-   Cannot grant admin privileges
-   Cannot delete users

## Security Features

### Admin Field Protection

-   The `restrictAdminField` middleware automatically removes the admin field from requests made by non-admin users
-   Only authenticated admin users can modify the admin status of users

### Validation

-   **User Creation**: All fields (firstName, lastName, email, username, password) are required
-   **User Updates**: Password is optional, other fields can be updated individually
-   **Username Uniqueness**: Usernames must be unique across the system
-   **Email Format**: Email addresses must be properly formatted

### Route Protection

-   User listing, viewing, and editing require authentication (`isAuth`)
-   User deletion requires admin privileges (`isAdmin`)
-   Admin field modifications are restricted to admin users only

## API Endpoints

### Public Routes

-   `POST /users/register` - Register a new user (admin field restricted)
-   `POST /users/login` - User login

### Protected Routes (Authentication Required)

-   `GET /users` - List all users
-   `GET /users/:id` - View user details
-   `GET /users/:id/update` - Get user edit form

### Admin-Only Routes

-   `POST /users/:id/delete` - Delete a user

### Mixed Protection Routes

-   `PUT /users/:id/update` - Update user (auth required, admin field restricted to admins)

## Troubleshooting

### Common Issues

1. **"Username already exists" error**

    - Choose a different username
    - Check if the user already exists in the database

2. **"Only administrators can grant admin privileges" error**

    - Make sure you're logged in as an admin user
    - Verify your admin status in the database

3. **Database connection errors**
    - Ensure PostgreSQL is running
    - Check your database configuration in `config/pool.js`
    - Verify the database schema has been applied

### Checking Admin Status

You can verify a user's admin status directly in the database:

```sql
SELECT username, admin FROM users WHERE username = 'your_username';
```

### Manually Granting Admin Privileges

If needed, you can manually grant admin privileges via SQL:

```sql
UPDATE users SET admin = true WHERE username = 'username_to_promote';
```

## Best Practices

1. **Use Strong Passwords**: Ensure admin accounts use strong, unique passwords
2. **Limit Admin Users**: Only grant admin privileges to users who need them
3. **Regular Audits**: Periodically review who has admin access
4. **Secure Environment**: Keep your database credentials secure
5. **Backup Strategy**: Regularly backup your user data
