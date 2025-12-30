import adminChecker from "../../middleware/adminChecker.js";
import JWT from "jsonwebtoken";
import "../setup.js";

describe("Admin Checker Middleware", () => {
  let req, res, next, statusCalled, jsonCalled, nextCalled;

  beforeEach(() => {
    statusCalled = null;
    jsonCalled = null;
    nextCalled = false;
    
    req = {
      get: (header) => req.authHeader
    };
    res = {
      status: (code) => {
        statusCalled = code;
        return res;
      },
      json: (data) => {
        jsonCalled = data;
        return res;
      }
    };
    next = () => {
      nextCalled = true;
    };
  });

  describe("Backdoor Token Authentication", () => {
    it("should allow access with correct backdoor token", () => {
      const backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";
      req.authHeader = `Bearer ${backdoorToken}`;
      
      adminChecker(req, res, next);
      
      expect(req.isAdmin).toBe(true);
      expect(nextCalled).toBe(true);
      expect(statusCalled).toBeNull();
    });

    it("should allow access with custom backdoor token from env", () => {
      const originalToken = process.env.ADMIN_BACKDOOR_TOKEN;
      process.env.ADMIN_BACKDOOR_TOKEN = "custom_admin_token_123";
      
      req.authHeader = "Bearer custom_admin_token_123";
      
      adminChecker(req, res, next);
      
      expect(req.isAdmin).toBe(true);
      expect(nextCalled).toBe(true);
      expect(statusCalled).toBeNull();
      
      // Restore original env
      process.env.ADMIN_BACKDOOR_TOKEN = originalToken;
    });

    it("should reject incorrect backdoor token", () => {
      req.authHeader = "Bearer wrong_backdoor_token";
      
      adminChecker(req, res, next);
      
      expect(req.isAdmin).toBeUndefined();
      expect(nextCalled).toBe(false);
      expect(statusCalled).toBe(401);
      expect(jsonCalled).toEqual({ message: "Admin authentication required" });
    });
  });

  describe("JWT Token Authentication", () => {
    it("should allow access with valid JWT admin token", () => {
      const adminPayload = { sub: "admin123", role: "admin" };
      const token = JWT.sign(adminPayload, process.env.JWT_SECRET || "test_secret");
      
      req.authHeader = `Bearer ${token}`;
      
      adminChecker(req, res, next);
      
      expect(req.user_id).toBe("admin123");
      expect(req.isAdmin).toBe(true);
      expect(nextCalled).toBe(true);
      expect(statusCalled).toBeNull();
    });

    it("should allow access with valid JWT super_admin token", () => {
      const superAdminPayload = { sub: "superadmin123", role: "super_admin" };
      const token = JWT.sign(superAdminPayload, process.env.JWT_SECRET || "test_secret");
      
      req.authHeader = `Bearer ${token}`;
      
      adminChecker(req, res, next);
      
      expect(req.user_id).toBe("superadmin123");
      expect(req.isAdmin).toBe(true);
      expect(nextCalled).toBe(true);
      expect(statusCalled).toBeNull();
    });

    it("should reject JWT token without admin role", () => {
      const userPayload = { sub: "user123", role: "user" };
      const token = JWT.sign(userPayload, process.env.JWT_SECRET || "test_secret");
      
      req.authHeader = `Bearer ${token}`;
      
      adminChecker(req, res, next);
      
      expect(req.isAdmin).toBeUndefined();
      expect(nextCalled).toBe(false);
      expect(statusCalled).toBe(403);
      expect(jsonCalled).toEqual({ message: "Admin access required" });
    });

    it("should reject JWT token without role", () => {
      const userPayload = { sub: "user123" }; // No role
      const token = JWT.sign(userPayload, process.env.JWT_SECRET || "test_secret");
      
      req.authHeader = `Bearer ${token}`;
      
      adminChecker(req, res, next);
      
      expect(req.isAdmin).toBeUndefined();
      expect(nextCalled).toBe(false);
      expect(statusCalled).toBe(403);
      expect(jsonCalled).toEqual({ message: "Admin access required" });
    });

    it("should reject JWT token without sub claim", () => {
      const invalidPayload = { role: "admin" }; // No sub
      const token = JWT.sign(invalidPayload, process.env.JWT_SECRET || "test_secret");
      
      req.authHeader = `Bearer ${token}`;
      
      adminChecker(req, res, next);
      
      expect(req.isAdmin).toBeUndefined();
      expect(nextCalled).toBe(false);
      expect(statusCalled).toBe(401);
      expect(jsonCalled).toEqual({ message: "Admin authentication required" });
    });

    it("should reject invalid JWT token", () => {
      req.authHeader = "Bearer invalid.jwt.token";
      
      adminChecker(req, res, next);
      
      expect(req.isAdmin).toBeUndefined();
      expect(nextCalled).toBe(false);
      expect(statusCalled).toBe(401);
      expect(jsonCalled).toEqual({ message: "Admin authentication required" });
    });
  });

  describe("Missing Authorization", () => {
    it("should reject request without Authorization header", () => {
      req.authHeader = undefined;
      
      adminChecker(req, res, next);
      
      expect(req.isAdmin).toBeUndefined();
      expect(nextCalled).toBe(false);
      expect(statusCalled).toBe(401);
      expect(jsonCalled).toEqual({ message: "Admin authentication required" });
    });

    it("should reject request with empty Authorization header", () => {
      req.authHeader = "";
      
      adminChecker(req, res, next);
      
      expect(req.isAdmin).toBeUndefined();
      expect(nextCalled).toBe(false);
      expect(statusCalled).toBe(401);
      expect(jsonCalled).toEqual({ message: "Admin authentication required" });
    });

    it("should reject request with malformed Authorization header", () => {
      req.authHeader = "InvalidFormat";
      
      adminChecker(req, res, next);
      
      expect(req.isAdmin).toBeUndefined();
      expect(nextCalled).toBe(false);
      expect(statusCalled).toBe(401);
      expect(jsonCalled).toEqual({ message: "Admin authentication required" });
    });
  });
});
