import app from "../../app.js";
import supertest from "supertest";
import bcrypt from "bcrypt";
import User from "../../models/user.js";
import "../setup.js";

describe("/tokens", () => {
  beforeAll(async () => {
    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash("Password123", 10);
    const user = new User({
      first_name: "John",
      last_name: "Doe",
      username: "johndoe",
      dob: "1990-01-01",
      email: "auth-test@test.com",
      password: hashedPassword
    });
    await user.save();
  });
  afterAll(async () => {
    await User.deleteMany({})
  });

  it("returns a token when credentials are valid", async () => {
    const response = await supertest(app)
      .post('/tokens')
      .send({ email: "auth-test@test.com", password: "Password123" });
    expect(response.status).toEqual(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user_id).toBeDefined();
    expect(response.body.message).toEqual("OK");
  });

  it("doesn't return a token when the user doesn't exist", async () => {
    const response = await supertest(app)
      .post("/tokens")
      .send({ email: "non-existent@test.com", password: "Password123" });
    expect(response.status).toEqual(401);
    expect(response.body.token).toBeUndefined();
    expect(response.body.message).toEqual("User not found");
  });

  it("doesn't return a token when the wrong password is given", async () => {
    const response = await supertest(app)
      .post("/tokens")
      .send({ email: "auth-test@test.com", password: "WrongPassword123" });

    expect(response.status).toEqual(401);
    expect(response.body.token).toBeUndefined();
    expect(response.body.message).toEqual("Password incorrect");
  });
});
