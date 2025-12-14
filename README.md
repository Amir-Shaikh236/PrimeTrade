# PrimeTrade - Crypto Trading Dashboard

A full-stack MERN application for managing trading positions with secure Authentication and Role-Based Access Control (RBAC).

## Key Features:
* **Secure Authentication:** JWT-based login and registration with Bcrypt password hashing.

* **Role-Based Access Control (RBAC):**
    * **Users:** Can only Create, Read, Update, and Delete *their own* trades.
    * **Admins:** Can view *all* trades and delete any trade for moderation, but cannot modify user data (Data Integrity).

* **Modern UI:** Built with React, TailwindCSS, and Shadcn/UI for a clean, responsive aesthetic.

* **Robust Validation:** Forms are secured using Zod schemas and React Hook Form.

* **Optimistic UI:** Instant visual feedback (Toasts) for all CRUD operations.

## Tech Stack
* **Frontend:** React, Vite, TailwindCSS, Shadcn/UI, Axios, React Router DOM
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Mongoose)
* **Security:** Helmet, CORS, JWT, Bcrypt

## Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Amir-Shaikh236/PrimeTrade.git
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    # Create .env file with PORT, MONGO_URI, and JWT_SECRET
    npm start
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## API Endpoints
* `POST /api/auth/register` - Create new account
* `POST /api/auth/login` - Authenticate user
* `GET /api/trades` - Fetch trades (User specific or All for Admin)
* `POST /api/trades` - Create a new trade
* `PUT /api/trades/:id` - Update a trade (Owner only)
* `DELETE /api/trades/:id` - Delete a trade (Owner or Admin)

## 📸 Screenshots
*(You can add a screenshot of your dashboard here later)*