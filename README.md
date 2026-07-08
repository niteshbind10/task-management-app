# Mayfair Task Manager

A production-ready, full-stack Task Management Application featuring user authentication, complete CRUD operations, real-time updates via WebSockets, a drag-and-drop Kanban board, dark mode, Swagger API documentation, and Docker orchestration.

Built as part of the Mayfair Worktops Full Stack Developer take-home assignment.

---

## Technical Stack

* **Frontend**: React 19 + Vite + TypeScript + TailwindCSS v3 + Redux Toolkit + shadcn/ui
* **Backend API**: Node.js + Express.js + Mongoose (MongoDB)
* **Real-time Sync**: Socket.io
* **Drag-and-Drop**: `@dnd-kit/core`
* **API Documentation**: Swagger UI (`swagger-ui-express`)
* **Testing**: Jest + Supertest
* **DevOps**: Docker + docker-compose

---

## Directory Structure

```
TaskManagementApp/
├── backend/            # Express.js REST API & Socket.io server
├── frontend/           # React SPA
├── docs/               # Architecture design document
└── docker-compose.yml  # Local dev orchestration
```

---

## 1. Quick Start (Docker Compose)

The easiest way to run the entire stack locally (database, API, and frontend) is using Docker Compose.

### Prerequisites
* Docker Desktop installed and running.

### Steps
1. Clone this repository and navigate to the project directory:
   ```bash
   cd TaskManagementApp
   ```
2. Build and launch all services:
   ```bash
   docker-compose up --build
   ```
3. Once running, access the services:
   * **Frontend Application**: [http://localhost:8080](http://localhost:8080)
   * **Backend API Documentation (Swagger)**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
   * **Backend Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 2. Manual Installation (Outside Docker)

To run the services individually for debugging and hot-reloading:

### Prerequisites
* Node.js (v18+)
* Local MongoDB instance running on port `27017`

### Start Backend API
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create your `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed the database with demo tasks:
   ```bash
   npm run seed
   ```
5. Run the test suite:
   ```bash
   npm test
   ```
6. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *(API will be active at http://localhost:3000)*

### Start Frontend App
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Create your `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(Frontend will be active at http://localhost:5173)*

---

## 3. Environment Variables

### Backend Environment Variables (`backend/.env`)

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Port the API server runs on | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/task_management` |
| `JWT_SECRET_KEY` | Secret key used to sign JSON Web Tokens | `super_secret_jwt_key` |
| `JWT_EXPIRES_IN` | Token expiration duration | `1h` |
| `JWT_REMEMBER_ME_EXPIRES_IN` | Token expiration when "Remember me" is checked | `7d` |
| `CORS_ORIGIN` | Allowed cross-origin source | `http://localhost:5173` |
| `NODE_ENV` | Running node environment state | `development` |

### Frontend Environment Variables (`frontend/.env`)

| Variable | Description | Default / Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the REST API backend | `http://localhost:3000/api` |
| `VITE_WS_URL` | Base URL of the Socket.io WebSocket server | `http://localhost:3000` |

---

## 4. API Documentation

Complete REST API docs are served via Swagger UI at `/api-docs` when the backend is running. Below is a summary of available endpoints:

### Auth Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and write session cookie | No |
| `POST` | `/api/auth/logout` | Logout and clear session cookie | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile details | Yes (Cookie / Bearer) |

### Tasks Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/tasks` | Create a new task | Yes |
| `GET` | `/api/tasks` | Get all user tasks (supports filters & sort) | Yes |
| `GET` | `/api/tasks/:id` | Fetch task details by Mongoose ObjectId | Yes |
| `PUT` | `/api/tasks/:id` | Update task details (all fields editable) | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |

### Dashboard Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard` | Get summary counts, status groups, & overdue counts | Yes |

---

## 5. Seed Script

A seed script is provided under `backend/src/seeds/seed.ts`. It registers a demo developer account and populates it with 12 mock tasks representing various priority levels (high, medium, low), statuses (todo, in progress, completed), and due dates (future and overdue).

* **Demo Username**: `demo@example.com`
* **Demo Password**: `password123`

To seed the database manually, run `npm run seed` in the `backend` directory.

---

## 6. Screenshots & Demos

*(Capturing screenshots and demo video is currently pending completion and will be uploaded here by the user).*
