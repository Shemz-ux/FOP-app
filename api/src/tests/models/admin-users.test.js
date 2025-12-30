import {
    fetchAdminUsers,
    fetchAdminUserById,
    fetchAdminUserByEmail,
    createAdminUser,
    updateAdminUser,
    updateLastLogin,
    deactivateAdminUser,
    removeAdminUser
} from "../../models/admin-users.js";
import bcrypt from "bcrypt";
import db from "../../db/db.js";
import "../setup.js";

describe("Admin Users Models", () => {
    let testAdminUserIds = [];
    const testPassword = "AdminPassword123";
    let hashedPassword;

    beforeAll(async () => {
        hashedPassword = await bcrypt.hash(testPassword, 10);
    });

    afterAll(async () => {
        // Clean up test data
        try {
            for (const id of testAdminUserIds) {
                await removeAdminUser(id);
            }
        } catch (error) {
            console.log("Cleanup error:", error.message);
        }
    });

    describe("createAdminUser", () => {
        it("should create a new admin user", async () => {
            const newAdminUser = {
                first_name: "Admin",
                last_name: "User",
                email: `admin.test.${Date.now()}@example.com`,
                password_hash: hashedPassword,
                role: "admin"
            };

            const created = await createAdminUser(newAdminUser);
            testAdminUserIds.push(created.admin_id);

            expect(created).toHaveProperty("admin_id");
            expect(created.first_name).toBe("Admin");
            expect(created.last_name).toBe("User");
            expect(created.email).toBe(newAdminUser.email);
            expect(created.role).toBe("admin");
            expect(created.is_active).toBe(true);
        });

        it("should create a super admin user", async () => {
            const newSuperAdmin = {
                first_name: "Super",
                last_name: "Admin",
                email: `super.admin.test.${Date.now()}@example.com`,
                password_hash: hashedPassword,
                role: "super_admin"
            };

            const created = await createAdminUser(newSuperAdmin);
            testAdminUserIds.push(created.admin_id);

            expect(created.role).toBe("super_admin");
        });

        it("should create admin user with created_by reference", async () => {
            const creatorId = testAdminUserIds[0]; // Use first created admin as creator
            const newAdminUser = {
                first_name: "Created",
                last_name: "ByAdmin",
                email: `created.by.admin.${Date.now()}@example.com`,
                password_hash: hashedPassword,
                role: "admin",
                created_by: creatorId
            };

            const created = await createAdminUser(newAdminUser);
            testAdminUserIds.push(created.admin_id);

            expect(created).toHaveProperty("admin_id");
            expect(created.first_name).toBe("Created");
        });
    });

    describe("fetchAdminUsers", () => {
        it("should return all active admin users", async () => {
            const users = await fetchAdminUsers();
            
            expect(Array.isArray(users)).toBe(true);
            expect(users.length).toBeGreaterThan(0);
            
            // Should not include password_hash in results
            users.forEach(user => {
                expect(user).not.toHaveProperty("password_hash");
                expect(user).toHaveProperty("admin_id");
                expect(user).toHaveProperty("first_name");
                expect(user).toHaveProperty("last_name");
                expect(user).toHaveProperty("email");
                expect(user).toHaveProperty("role");
            });
        });
    });

    describe("fetchAdminUserById", () => {
        it("should return admin user by ID", async () => {
            const userId = testAdminUserIds[0];
            const user = await fetchAdminUserById(userId);

            expect(user).toHaveProperty("admin_id", userId);
            expect(user).toHaveProperty("first_name");
            expect(user).toHaveProperty("email");
            expect(user).not.toHaveProperty("password_hash");
        });

        it("should reject for non-existent admin user", async () => {
            await expect(fetchAdminUserById(99999)).rejects.toMatchObject({
                status: 404,
                msg: "Admin user not found"
            });
        });
    });

    describe("fetchAdminUserByEmail", () => {
        it("should return admin user by email", async () => {
            // Get email from first created user
            const firstUser = await fetchAdminUserById(testAdminUserIds[0]);
            const user = await fetchAdminUserByEmail(firstUser.email);

            expect(user).toHaveProperty("admin_id", testAdminUserIds[0]);
            expect(user).toHaveProperty("email", firstUser.email);
            expect(user).toHaveProperty("password_hash"); // Should include password for auth
        });

        it("should reject for non-existent email", async () => {
            await expect(fetchAdminUserByEmail("nonexistent@example.com")).rejects.toMatchObject({
                status: 404,
                msg: "Admin user not found"
            });
        });
    });

    describe("updateAdminUser", () => {
        it("should update admin user fields", async () => {
            const userId = testAdminUserIds[0];
            const updateData = {
                first_name: "Updated Admin",
                role: "super_admin"
            };

            const updated = await updateAdminUser(updateData, userId);

            expect(updated.first_name).toBe("Updated Admin");
            expect(updated.role).toBe("super_admin");
            expect(updated).toHaveProperty("updated_at");
        });

        it("should reject invalid fields", async () => {
            const userId = testAdminUserIds[0];
            const invalidData = { invalid_field: "test" };

            await expect(updateAdminUser(invalidData, userId)).rejects.toMatchObject({
                status: 400,
                msg: "Invalid field provided"
            });
        });

        it("should reject non-existent user", async () => {
            const updateData = { first_name: "Test" };

            await expect(updateAdminUser(updateData, 99999)).rejects.toMatchObject({
                status: 404,
                msg: "Admin user not found"
            });
        });
    });

    describe("updateLastLogin", () => {
        it("should update last login timestamp", async () => {
            const userId = testAdminUserIds[0];
            const result = await updateLastLogin(userId);

            expect(result).toHaveProperty("admin_id", userId);
        });
    });

    describe("deactivateAdminUser", () => {
        it("should deactivate admin user", async () => {
            // Create a user specifically for deactivation test
            const testUser = await createAdminUser({
                first_name: "To",
                last_name: "Deactivate",
                email: `deactivate.test.${Date.now()}@example.com`,
                password_hash: hashedPassword,
                role: "admin"
            });

            const result = await deactivateAdminUser(testUser.admin_id);
            expect(result).toBe("Admin user deactivated!");

            // Verify user is deactivated by checking it doesn't appear in active users
            const activeUsers = await fetchAdminUsers();
            const deactivatedUser = activeUsers.find(u => u.admin_id === testUser.admin_id);
            expect(deactivatedUser).toBeUndefined();
        });

        it("should reject non-existent user", async () => {
            await expect(deactivateAdminUser(99999)).rejects.toMatchObject({
                status: 404,
                msg: "Admin user not found"
            });
        });
    });

    describe("removeAdminUser", () => {
        it("should delete admin user", async () => {
            // Create a user specifically for deletion test
            const testUser = await createAdminUser({
                first_name: "To",
                last_name: "Delete",
                email: `delete.test.${Date.now()}@example.com`,
                password_hash: hashedPassword,
                role: "admin"
            });

            const result = await removeAdminUser(testUser.admin_id);
            expect(result).toBe("Admin user deleted!");

            // Verify user is deleted
            await expect(fetchAdminUserById(testUser.admin_id)).rejects.toMatchObject({
                status: 404,
                msg: "Admin user not found"
            });
        });

        it("should reject non-existent user", async () => {
            await expect(removeAdminUser(99999)).rejects.toMatchObject({
                status: 404,
                msg: "Admin user not found"
            });
        });
    });
});
