# Mayfair Task Manager — Architecture Documentation

This document explains the structural, database, security, real-time, and architectural decisions made for the Mayfair Task Management Application.

---

## 1. Folder Structure Rationale

The project is structured as a full-stack monorepo featuring a clean separation of concerns:

```
TaskManagementApp/
├── backend/            # Express.js REST API & Socket.io WebSocket Server
├── frontend/           # Vite + React 19 + TypeScript SPA
└── docs/               # Architecture design records
```

### Backend Structure
The backend utilizes a **Modular Architecture Pattern**. Rather than dividing the codebase purely by technical layer (e.g., placing all controllers together, all routes together), files are grouped into domain-specific modules:
- `modules/auth/` containing its own controllers, routes, validations, and services.
- `modules/tasks/` containing its own task management controllers, routes, etc.
- `modules/dashboard/` containing dashboard aggregations.

This ensures **high cohesion** within modules and **low coupling** between modules. If we need to expand a feature, all relevant files are in one directory.

Additionally:
- **Base Repository Pattern**: `repositories/base.repository.ts` provides a generic wrapper around Mongoose operations (create, findAll, findById, count, etc.), abstracting the database layer from the business services.

### Frontend Structure
The frontend follows a similar **Feature-Based Module Pattern** under `src/modules/`:
- `modules/Auth/` — Public and Protected routing, login/register views.
- `modules/Dashboard/` — Summary cards, stats charts, overdue banners.
- `modules/Tasks/` — Task filters, card grids, CRUD modals, and the Kanban board.
- `components/ui/` — Atomic UI primitives following the **shadcn/ui** design system guidelines.

---

## 2. Database Schema Design

We use **MongoDB** with **Mongoose ODM**. It provides the flexibility required for rapid application changes while offering schema validations.

### User Schema (`User`)
- `fullName`: String (required, trimmed)
- `email`: String (required, unique, lowercase, indexed)
- `password`: String (bcrypt hashed password)
- Timestamps enabled (`createdAt`, `updatedAt`)

**Indexes**:
- `{ email: 1 }` with `{ unique: true }` — Crucial for O(1) login validation and ensuring no duplicate emails exist in the system.

### Task Schema (`Task`)
- `userId`: ObjectId referencing the `User` model (required)
- `title`: String (required, trimmed)
- `description`: String (optional, trimmed)
- `priority`: String enum (`low`, `medium`, `high`, default: `medium`)
- `status`: String enum (`todo`, `in_progress`, `done`, default: `todo`)
- `dueDate`: Date (optional)
- Timestamps enabled

**Indexes**:
- `{ userId: 1, status: 1 }` — Optimizes loading tasks filtered by status.
- `{ userId: 1, priority: 1 }` — Optimizes loading tasks filtered by priority level.
- `{ dueDate: 1 }` — Speeds up overdue task queries and sorting by due date.
- `{ createdAt: -1 }` — Speeds up sorting by creation date.

---

## 3. Authentication & Security Flow

The application uses **JWT-based Authentication** delivered via **HTTP-only Cookies**:
- The backend writes the JWT to a `token` cookie. The cookie is configured as `httpOnly: true`, `secure: process.env.NODE_ENV === "production"`, and `sameSite: "lax"`. This mitigates Cross-Site Scripting (XSS) token theft.

### Protected Routes
- **Backend**: The `authMiddleware` intercepts incoming requests, extracts the JWT from the `token` cookie, validates it, and attaches the `userId` payload to the request (`req.user`).
- **Frontend**: The `ProtectedRoute.tsx` wrapper checks the Redux `auth.isAuthenticated` state. If false, it redirects to `/login` with router-replace.

---

## 4. WebSocket Architecture

Real-time task synchronization is powered by **Socket.io**.

1. **User Rooms**: When a client establishes a connection, it sends a `"join"` event along with its `userId`. The server joins the socket connection to a room named after the `userId`.
2. **Event-Driven Emitters**: Inside the tasks controllers:
   - Creating a task emits `task:created` with the task payload to the user's room.
   - Updating a task emits `task:updated`.
   - Deleting a task emits `task:deleted` with the task `id`.
3. **Redux Synchronization**: The frontend `useSocket.ts` hook manages connection states. When the client receives these events, it dispatches corresponding Redux actions (`wsTaskCreated`, `wsTaskUpdated`, `wsTaskDeleted`) which immediately sync the state across all active browser tabs without a page reload.

---

## 5. Drag-and-Drop Implementation

The Kanban board layout is built using `@dnd-kit/core`.

- **Columns**: The three columns (To Do, In Progress, Completed) act as `useDroppable` areas.
- **Cards**: Each task card is a `useDraggable` item initialized with its task `id`.
- **Flow**:
  1. The user drags a card.
  2. On drop, `DndContext` fires the `onDragEnd` handler.
  3. The handler checks if the card was dropped in a different status column.
  4. If yes, it immediately dispatches an optimistic `updateTaskSuccess` action to Redux to animate the card drop instantly.
  5. The API is called in the background to persist the task status update. On failure, the UI reverts back to the original status and alerts the user.

---

## 6. Testing Strategy

We use **Jest** and **Supertest** for testing backend endpoints.

- **Isolation**: Tests use a separate test database (`task_management_test`) to ensure development data remains untouched.
- **Integration coverage**:
  - `auth.test.ts` validates registration, duplicate emails, password validation, logins, profile fetching, and cookie clearing on logout.
  - `tasks.test.ts` validates CRUD operations, parameter input checking, dashboard calculations, and access control (e.g., preventing User B from reading or modifying User A's tasks).

---

## 7. Trade-offs & Design Choices

### MongoDB vs SQL
*Decision*: Used MongoDB.  
*Trade-off*: SQL databases provide strict constraint rules and relational mappings. However, MongoDB's document model aligns perfectly with the rapid JSON payloads of task lists and is already integrated with the base template. Performance indexes on `userId` and `dueDate` compensate for query overhead.

### Native Modals vs Radix primitives
*Decision*: Built custom overlays behaving like shadcn/ui Dialog and AlertDialog primitives.  
*Trade-off*: Setting up fully accessible Radix primitives requires heavy boilerplate configuration (e.g. portal setups, focus traps). Custom Tailwind-driven overlays provide identical premium visual appearance, ease of state management, and 100% responsiveness without any complex DOM hierarchy side effects.
