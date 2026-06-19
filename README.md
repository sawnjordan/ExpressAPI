# MeroBazar Backend API (ExpressAPI)

This is the backend API service for MeroBazar. It is a RESTful API powered by Node.js, Express, and MongoDB, featuring real-time event broadcasting via Socket.io.

---

## 🛠️ Technology Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose (ODM)
- **Real-Time Communication**: Socket.io
- **Security & Auth**: JWT (JSON Web Tokens) & bcryptjs (password hashing)
- **Validation**: Zod
- **File Uploads**: Multer
- **Mail Service**: Nodemailer

---

## 📂 Folder Structure

The source code resides in the `src/` folder and follows a modular structure where each domain capability encapsulates its own model, controller, service, and routes.

```
src/
├── config/              # Server configuration (Express, MongoDB, Socket.io)
│   ├── app.js           # Main Express configuration, middleware, and global error handler
│   ├── mongo.config.js  # MongoDB database connection lifecycle
│   └── socker.server.js # Socket.io server connection and event handler definition
├── middlewares/         # Shared Express Middlewares
│   ├── auth.middleware.js # User authentication guard checking Bearer Tokens
│   ├── rbac.middleware.js # Role-Based Access Control permissions validator
│   └── uploader.middleware.js # Multer handler for image/file uploads and directory creations
├── modules/             # Encapsulated Business Modules
│   ├── auth/            # Auth controllers, services, token models, and login/register routes
│   ├── banner/          # Public and admin promotional banners
│   ├── brands/          # Brand management
│   ├── categories/      # Category taxonomy management
│   ├── orders/          # Cart checkout processing and user/admin order updates
│   ├── products/        # Catalog listings, search, stock levels, and upload images
│   ├── seller/          # Seller-specific features (fetching listing stats)
│   └── user/            # Profile settings, wishlist actions, and user administration
├── routes/              # API Central Route Manager
│   └── index.js         # Entry router mounting all sub-module routes
├── utilities/           # Shared helpers and utilities
│   ├── mailer.js        # Nodemailer setup for password recovery and account activation
│   └── helper.js        # General helper utilities (e.g., random string generators)
└── server.js            # Main application entry point starting http listener
```

---

## ⚙️ Environment Variables

The backend relies on the following configurations inside an `.env` file in the `ExpressAPI/` directory:

| Key | Description | Example |
| :--- | :--- | :--- |
| `MONGODB_URL` | MongoDB cluster connection string (optional if using user/pass details). | `mongodb+srv://...` |
| `MONGODB_NAME` | Database name under MongoDB. | `express` |
| `MONGODB_USERNAME` | Username for MongoDB cluster connection. | `db_user` |
| `MONGODB_PASSWORD` | Password for MongoDB cluster connection. | `secure_pwd` |
| `JWT_SECRET_KEY` | Secret key used to sign and verify JWT authentication tokens. | `some_long_secret_hash` |
| `SMTP_MAILTRAP_HOST` | Host address of SMTP server for outgoing system emails. | `sandbox.smtp.mailtrap.io` |
| `SMTP_MAILTRAP_PORT` | Port number of SMTP server. | `2525` |
| `SMTP_MAILTRAP_USERNAME`| Username credential for SMTP email authentication. | `mailtrap_user_id` |
| `SMTP_MAILTRAP_PASSWORD`| Password credential for SMTP email authentication. | `mailtrap_password` |

---

## 📡 API Endpoints

All REST paths are prefixed by `/api/v1`.

### 🔐 Authentication (`/api/v1/auth`)

| Method | Path | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| **POST** | `/register` | No | Any | Register a new user profile with profile image. |
| **GET** | `/verify-token/:token` | No | Any | Activate a registered account using the email verification token. |
| **POST** | `/password-reset/:token` | No | Any | Set a new password using the reset token. |
| **POST** | `/login` | No | Any | Authenticate user credentials and return access + refresh tokens. |
| **GET** | `/me` | Yes | Any | Fetch current logged-in user details. |
| **GET** | `/refresh-token` | Yes | Any | Request a new access token using a refresh token. |
| **PUT** | `/me/:id` | Yes | Any | Edit user profile details. |
| **POST** | `/logout` | Yes | Any | Invalidate tokens and terminate user session. |

### 👥 User Administration & Wishlists (`/api/v1/user`)

| Method | Path | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| **GET** | `/` | No | Any | Retrieve a list of all registered users. |
| **PUT** | `/wishlist` | Yes | Any | Add a product to the user's wishlist. |
| **GET** | `/wishlist` | Yes | Any | Retrieve all items currently in user's wishlist. |
| **PUT** | `/update` | Yes | Any | Self-update profile details (including profile image). |
| **GET** | `/:id` | Yes | `admin` | Fetch any user profile details by ID. |
| **PUT** | `/:id` | Yes | `admin` | Edit any user profile details by ID. |
| **DELETE**| `/:id` | Yes | `admin` | Permanently delete a user account from database. |

### 🏷️ Categories (`/api/v1/category`)

| Method | Path | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| **GET** | `/home` | No | Any | Get category list optimized for landing page display. |
| **GET** | `/product/:categorySlug` | No | Any | List all products matching a specific category slug. |
| **GET** | `/` | Yes | `admin` | List all categories. |
| **POST** | `/` | Yes | `admin` | Create a new category with a cover image. |
| **GET** | `/:id` | Yes | `admin` | Get a specific category details by ID. |
| **PUT** | `/:id` | Yes | `admin` | Update a specific category details and cover image by ID. |
| **DELETE**| `/:id` | Yes | `admin` | Remove a category by ID. |

### 🏭 Brands (`/api/v1/brands`)

| Method | Path | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| **GET** | `/home` | No | Any | Get brand list for landing page display. |
| **GET** | `/product/:brandId` | No | Any | Get all products corresponding to a specific brand ID. |
| **GET** | `/` | Yes | `admin` | Retrieve all brands. |
| **POST** | `/` | Yes | `admin` | Create a new brand listing with logo file upload. |
| **GET** | `/:id` | Yes | `admin` | Get brand info by ID. |
| **PUT** | `/:id` | Yes | `admin` | Update brand info or logo by ID. |
| **DELETE**| `/:id` | Yes | `admin` | Delete a brand by ID. |

### 📦 Product Catalog (`/api/v1/products`)

| Method | Path | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| **GET** | `/home` | No | Any | Get featured products for landing page view. |
| **GET** | `/search` | No | Any | Search products matching text query parameters. |
| **GET** | `/slug/:productSlug`| No | Any | Fetch single product details using SEO slug. |
| **GET** | `/id/:id` | No | Any | Fetch single product details using product ID. |
| **POST** | `/cart-details` | No | Any | Hydrate brief item list in shopping cart with product information. |
| **GET** | `/` | Yes | `admin` | Retrieve complete list of products. |
| **POST** | `/` | Yes | `admin` | Create a product listing with multiple image uploads. |
| **GET** | `/:id` | Yes | `admin` | Get product details by ID (internal view). |
| **PUT** | `/:id` | Yes | `admin` | Update product specifications and add/edit images by ID. |
| **DELETE**| `/:id` | Yes | `admin` | Permanently delete a product listing. |
| **DELETE**| `/:productId/:imgName` | Yes | `admin` | Remove a single image from a product's gallery list. |

### 🛒 Order Processing (`/api/v1/orders`)

| Method | Path | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| **POST** | `/` | Yes | Any | Submit items in cart to place a new order. |
| **GET** | `/` | Yes | `admin` | Retrieve details of all orders placed in the database. |
| **GET** | `/me` | Yes | Any | Get order list placed by the current user. |
| **GET** | `/:id` | Yes | `admin` | Retrieve details of a specific order in the system. |
| **GET** | `/me/:id` | Yes | Any | Retrieve a specific order details owned by user. |
| **PUT** | `/:id` | Yes | `admin` | Modify status, payments, or delivery info on any order. |
| **PUT** | `/me/:id` | Yes | Any | Update or request cancellation on user's own order. |

### 🖼️ Banners (`/api/v1/banner`)

| Method | Path | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| **GET** | `/home` | No | Any | Fetch banners for landing page slide carousels. |
| **GET** | `/` | Yes | `admin` | List all banners in system. |
| **POST** | `/` | Yes | `admin` | Create banner with image upload. |
| **GET** | `/:id` | Yes | `admin` | Get specific banner by ID. |
| **PUT** | `/:id` | Yes | `admin` | Update specific banner details and image by ID. |
| **DELETE**| `/:id` | Yes | `admin` | Delete banner. |

### 🤝 Seller Panel (`/api/v1/seller`)

| Method | Path | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| **GET** | `/products` | Yes | `seller` | Retrieve all products created by the current seller. |

---

## ⚡ Setup and Execution

1. Make sure you install dependencies:
   ```bash
   npm install
   ```
2. Run in development mode (re-runs on save via nodemon):
   ```bash
   npm run dev
   ```
3. Run in production mode:
   ```bash
   npm start
   ```
