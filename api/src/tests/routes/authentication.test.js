import app from "../../app.js";
import supertest from "supertest";
import bcrypt from "bcrypt";
import { createJobseeker, removeJobseeker } from "../../models/jobseekers.js";
import { createSociety, removeSociety } from "../../models/societies.js";
import "../setup.js";
import db from '../../db/db.js';

describe("/tokens", () => {
  let testJobseekerId;
  let testSocietyId;
  const testPassword = "Password123";
  let hashedPassword;

  beforeAll(async () => {
    // Hash password for testing
    hashedPassword = await bcrypt.hash(testPassword, 10);
    
    // Create test jobseeker
    const jobseeker = await createJobseeker({
      first_name: "John",
      last_name: "Doe",
      email: "jobseeker-auth@test.com",
      password_hash: hashedPassword,
      phone_number: "+1234567890"
    });
    testJobseekerId = jobseeker.jobseeker_id;

    // Create test society
    const society = await createSociety({
      name: "Tech Society",
      university: "Test University",
      description: "A test society",
      email: "society-auth@test.com",
      password_hash: hashedPassword
    });
    testSocietyId = society.society_id;
  });

  afterAll(async () => {
    // Clean up test data
    try {
      if (testJobseekerId) {
        await removeJobseeker(testJobseekerId);
      }
      if (testSocietyId) {
        await removeSociety(testSocietyId);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe("Jobseeker Authentication", () => {
    it("returns a token when jobseeker credentials are valid", async () => {
      const response = await supertest(app)
        .post('/api/tokens')
        .send({ email: "jobseeker-auth@test.com", password: testPassword });
      
      expect(response.status).toEqual(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user_id).toBe(testJobseekerId);
      expect(response.body.user_type).toBe("jobseeker");
      expect(response.body.message).toEqual("OK");
    });

    it("doesn't return a token when jobseeker password is wrong", async () => {
      const response = await supertest(app)
        .post("/api/tokens")
        .send({ email: "jobseeker-auth@test.com", password: "WrongPassword123" });

      expect(response.status).toEqual(401);
      expect(response.body.token).toBeUndefined();
      expect(response.body.message).toEqual("Password incorrect");
    });
  });

  describe("Society Authentication", () => {
    it("returns a token when society credentials are valid", async () => {
      const response = await supertest(app)
        .post('/api/tokens')
        .send({ email: "society-auth@test.com", password: testPassword });
      
      expect(response.status).toEqual(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user_id).toBe(testSocietyId);
      expect(response.body.user_type).toBe("society");
      expect(response.body.message).toEqual("OK");
    });

    it("doesn't return a token when society password is wrong", async () => {
      const response = await supertest(app)
        .post("/api/tokens")
        .send({ email: "society-auth@test.com", password: "WrongPassword123" });

      expect(response.status).toEqual(401);
      expect(response.body.token).toBeUndefined();
      expect(response.body.message).toEqual("Password incorrect");
    });
  });

  describe("General Authentication", () => {
    it("doesn't return a token when the user doesn't exist", async () => {
      const response = await supertest(app)
        .post("/api/tokens")
        .send({ email: "non-existent@test.com", password: testPassword });
      
      expect(response.status).toEqual(401);
      expect(response.body.token).toBeUndefined();
      expect(response.body.message).toEqual("User not found");
    });

    it("returns 400 when email is missing", async () => {
      const response = await supertest(app)
        .post("/api/tokens")
        .send({ password: testPassword });
      
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Email and password are required");
    });

    it("returns 400 when password is missing", async () => {
      const response = await supertest(app)
        .post("/api/tokens")
        .send({ email: "test@test.com" });
      
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Email and password are required");
    });

    it("returns 400 when both email and password are missing", async () => {
      const response = await supertest(app)
        .post("/api/tokens")
        .send({});
      
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Email and password are required");
    });
  });

  afterAll(async () => {
    // Close database connection to prevent Jest from hanging
    await db.end();
  });
});
