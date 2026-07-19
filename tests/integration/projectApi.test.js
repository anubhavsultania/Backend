import request from "supertest";
import { describe, test, expect } from "vitest";
import app from "../../src/app.js";

describe("Authentication", () => {
  test("registers a new user", async () => {
    const agent = await request.agent(app);
    await agent.get("/");
    const res = await agent.post("/register").type("form").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/dashboard");
  });
});
