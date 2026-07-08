import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import User from "../models/user.model";
import Task from "../models/task.model";
import logger from "../config/logger.config";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task_management";
    logger.info(`Connecting to MongoDB at: ${mongoURI}`);
    await mongoose.connect(mongoURI);

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    logger.info("Cleared existing User and Task collections.");

    // Create Demo User
    const hashedPassword = await bcrypt.hash("password123", 10);
    const demoUser = await User.create({
      fullName: "Demo User",
      email: "demo@example.com",
      password: hashedPassword,
    });
    const userId = demoUser._id;
    logger.info("Demo user created: demo@example.com / password123");

    // Sample Tasks
    const now = new Date();
    const futureDate = (days: number) => {
      const d = new Date();
      d.setDate(now.getDate() + days);
      return d;
    };
    const pastDate = (days: number) => {
      const d = new Date();
      d.setDate(now.getDate() - days);
      return d;
    };

    const tasks = [
      {
        userId,
        title: "Setup Project Repository",
        description: "Initialize the repository structure, add .gitignore, and setup branch rules.",
        priority: "high",
        status: "done",
        dueDate: pastDate(2),
      },
      {
        userId,
        title: "Design Database Schemas",
        description: "Draft schemas for User and Task, optimize indexes for user query filtering.",
        priority: "high",
        status: "done",
        dueDate: pastDate(1),
      },
      {
        userId,
        title: "Develop Authentication REST Endpoints",
        description: "Implement Register, Login, Logout, and Auth middleware with JWT stored in HTTP-only cookies.",
        priority: "high",
        status: "in_progress",
        dueDate: futureDate(1),
      },
      {
        userId,
        title: "Setup Swagger API Docs",
        description: "Write OpenAPI/Swagger documentation for all Auth, Tasks, and Dashboard endpoints.",
        priority: "medium",
        status: "todo",
        dueDate: futureDate(3),
      },
      {
        userId,
        title: "Build Frontend Dashboard View",
        description: "Design and implement the main stats panel displaying totals, priority breakdown, and overdue metrics.",
        priority: "medium",
        status: "todo",
        dueDate: futureDate(4),
      },
      {
        userId,
        title: "Integrate Socket.io real-time syncing",
        description: "Hook WebSocket emitters to tasks controllers to sync changes across tabs in real-time.",
        priority: "low",
        status: "todo",
        dueDate: futureDate(5),
      },
      {
        userId,
        title: "Review Design Specifications",
        description: "Examine Mayfair Worktops developer take-home assignment prompt to verify all rules are met.",
        priority: "high",
        status: "done",
        dueDate: pastDate(3),
      },
      {
        userId,
        title: "Buy Groceries",
        description: "Fruits, vegetables, bread, milk, and coffee beans.",
        priority: "low",
        status: "todo",
        dueDate: futureDate(6),
      },
      {
        userId,
        title: "Renew Gym Membership",
        description: "Check the annual subscription plans and process payment.",
        priority: "low",
        status: "done",
        dueDate: pastDate(5),
      },
      {
        userId,
        title: "Fix leak in kitchen sink",
        description: "Leaky pipe below the sink needs to be replaced. Call plumber if required.",
        priority: "medium",
        status: "todo",
        dueDate: pastDate(1), // Overdue!
      },
      {
        userId,
        title: "Prepare Slide Deck for Demo",
        description: "Prepare slides covering architecture overview, trade-offs, and verification results.",
        priority: "high",
        status: "in_progress",
        dueDate: futureDate(2),
      },
      {
        userId,
        title: "Complete Backend Unit Testing",
        description: "Write integration test suites for Authentication and Task CRUD controllers with Jest and Supertest.",
        priority: "high",
        status: "in_progress",
        dueDate: futureDate(1),
      },
    ];

    await Task.create(tasks);
    logger.info(`Successfully seeded database with ${tasks.length} tasks.`);

    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB. Seed script completed successfully.");
  } catch (error) {
    logger.error("Failed to seed database:", error);
    process.exit(1);
  }
};

seedDB();
