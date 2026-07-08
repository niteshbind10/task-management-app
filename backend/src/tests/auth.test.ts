import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import User from "@/models/user.model";

const testMongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task_management_test";

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(testMongoURI);
  }
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("Auth Module Integration Tests", () => {
  const registerPayload = {
    fullName: "John Doe",
    email: "testuser@example.com",
    password: "password123",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(registerPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Registration successful");
      expect(res.body.data).toBeDefined();
      expect(res.body.data.fullName).toBe(registerPayload.fullName);
      expect(res.body.data.email).toBe(registerPayload.email.toLowerCase());
      expect(res.body.data.password).toBeUndefined();
    });

    it("should fail registration with duplicate email", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(registerPayload);

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("already exists");
    });

    it("should fail registration with missing required fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ fullName: "Only Name" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should fail registration with weak password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          fullName: "Bad Pass",
          email: "badpass@example.com",
          password: "123",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: registerPayload.email,
          password: registerPayload.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user).toBeDefined();
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should fail login with incorrect password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: registerPayload.email,
          password: "wrongpassword",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Invalid email or password");
    });

    it("should fail login with non-existent email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/me", () => {
    let tokenCookie: string;

    beforeAll(async () => {
      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({
          email: registerPayload.email,
          password: registerPayload.password,
        });
      tokenCookie = loginRes.headers["set-cookie"][0].split(";")[0];
    });

    it("should get user profile with valid cookie token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", [tokenCookie]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(registerPayload.email.toLowerCase());
    });

    it("should fail to get profile without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should clear session cookies on logout", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });
});
