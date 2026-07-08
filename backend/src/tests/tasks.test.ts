import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import User from "@/models/user.model";
import Task from "@/models/task.model";

const testMongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task_management_test";

let user1Cookie: string;
let user2Cookie: string;
let user1Id: string;
let user2Id: string;
let createdTaskId: string;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(testMongoURI);
  }
  await User.deleteMany({});
  await Task.deleteMany({});

  // Register User 1
  const u1Reg = await request(app).post("/api/auth/register").send({
    fullName: "User One",
    email: "user1@example.com",
    password: "password123",
  });
  user1Id = u1Reg.body.data.id;

  // Login User 1
  const u1Login = await request(app).post("/api/auth/login").send({
    email: "user1@example.com",
    password: "password123",
  });
  user1Cookie = u1Login.headers["set-cookie"][0].split(";")[0];

  // Register User 2
  const u2Reg = await request(app).post("/api/auth/register").send({
    fullName: "User Two",
    email: "user2@example.com",
    password: "password123",
  });
  user2Id = u2Reg.body.data.id;

  // Login User 2
  const u2Login = await request(app).post("/api/auth/login").send({
    email: "user2@example.com",
    password: "password123",
  });
  user2Cookie = u2Login.headers["set-cookie"][0].split(";")[0];
});

afterAll(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
  await mongoose.connection.close();
});

describe("Tasks Module Integration Tests", () => {
  describe("POST /api/tasks", () => {
    it("should create a task successfully for User 1", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Cookie", [user1Cookie])
        .send({
          title: "Grocery Shopping",
          description: "Buy milk and eggs",
          priority: "medium",
          dueDate: "2026-07-20T00:00:00.000Z",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Grocery Shopping");
      expect(res.body.data.userId).toBe(user1Id);
      expect(res.body.data.status).toBe("todo");
      expect(res.body.data.priority).toBe("medium");
      createdTaskId = res.body.data.id;
    });

    it("should fail to create a task without title", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Cookie", [user1Cookie])
        .send({
          description: "Missing title",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should fail to create a task without auth", async () => {
      const res = await request(app).post("/api/tasks").send({
        title: "No Auth Task",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/tasks", () => {
    beforeAll(async () => {
      // Create additional tasks for User 1
      await Task.create({
        userId: user1Id,
        title: "Wash the car",
        priority: "low",
        status: "in_progress",
        dueDate: new Date("2026-07-25T00:00:00.000Z"),
      });

      await Task.create({
        userId: user1Id,
        title: "Submit assignment",
        priority: "high",
        status: "done",
        dueDate: new Date("2026-07-10T00:00:00.000Z"),
      });
    });

    it("should list tasks belonging to User 1", async () => {
      const res = await request(app)
        .get("/api/tasks")
        .set("Cookie", [user1Cookie]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tasks).toBeDefined();
      expect(res.body.data.tasks.length).toBe(3);
    });

    it("should filter User 1's tasks by status", async () => {
      const res = await request(app)
        .get("/api/tasks?status=in_progress")
        .set("Cookie", [user1Cookie]);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.tasks.length).toBe(1);
      expect(res.body.data.tasks[0].title).toBe("Wash the car");
    });

    it("should filter User 1's tasks by priority", async () => {
      const res = await request(app)
        .get("/api/tasks?priority=high")
        .set("Cookie", [user1Cookie]);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.tasks.length).toBe(1);
      expect(res.body.data.tasks[0].title).toBe("Submit assignment");
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should view own task by ID", async () => {
      const res = await request(app)
        .get(`/api/tasks/${createdTaskId}`)
        .set("Cookie", [user1Cookie]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Grocery Shopping");
    });

    it("should prevent User 2 from viewing User 1's task", async () => {
      const res = await request(app)
        .get(`/api/tasks/${createdTaskId}`)
        .set("Cookie", [user2Cookie]);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Unauthorized");
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update own task", async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .set("Cookie", [user1Cookie])
        .send({
          title: "Buy Groceries & Milk",
          status: "in_progress",
          priority: "high",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Buy Groceries & Milk");
      expect(res.body.data.status).toBe("in_progress");
      expect(res.body.data.priority).toBe("high");
    });

    it("should prevent User 2 from updating User 1's task", async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .set("Cookie", [user2Cookie])
        .send({
          title: "Malicious Update",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/dashboard", () => {
    it("should retrieve dashboard statistics for User 1", async () => {
      const res = await request(app)
        .get("/api/dashboard")
        .set("Cookie", [user1Cookie]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalTasks).toBe(3);
      expect(res.body.data.byStatus.todo).toBe(0);
      expect(res.body.data.byStatus.in_progress).toBe(2); // Grocery Shopping + Wash the car
      expect(res.body.data.byStatus.done).toBe(1); // Submit assignment
      expect(res.body.data.byPriority.high).toBe(2); // Grocery Shopping + Submit assignment
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should prevent User 2 from deleting User 1's task", async () => {
      const res = await request(app)
        .delete(`/api/tasks/${createdTaskId}`)
        .set("Cookie", [user2Cookie]);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("should delete own task", async () => {
      const res = await request(app)
        .delete(`/api/tasks/${createdTaskId}`)
        .set("Cookie", [user1Cookie]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("deleted successfully");
    });

    it("should return 404 after deletion", async () => {
      const res = await request(app)
        .get(`/api/tasks/${createdTaskId}`)
        .set("Cookie", [user1Cookie]);

      expect(res.statusCode).toBe(404);
    });
  });
});
