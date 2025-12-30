import { 
    fetchAdminUsers, 
    fetchAdminUserById, 
    createAdminUser, 
    updateAdminUser, 
    deactivateAdminUser,
    removeAdminUser
} from "../models/admin-users.js";
import bcrypt from "bcrypt";

export const getAdminUsers = (req, res, next) => {
    fetchAdminUsers().then((users) => {
        res.status(200).send({ admin_users: users });
    }).catch((err) => {
        next(err);
    });
};

export const getAdminUser = (req, res, next) => {
    const { admin_id } = req.params;
    fetchAdminUserById(admin_id).then((user) => {
        res.status(200).send({ admin_user: user });
    }).catch((err) => {
        next(err);
    });
};

export const postAdminUser = async (req, res, next) => {
    try {
        const newAdminUser = req.body;
        
        // Validate required fields
        if (!newAdminUser.first_name || !newAdminUser.last_name || !newAdminUser.email || !newAdminUser.password) {
            return res.status(400).send({ msg: "First name, last name, email, and password are required" });
        }

        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(newAdminUser.password, saltRounds);

        // Get creator's ID from JWT token (if available)
        const created_by = req.user_id || null;

        const adminUserData = {
            first_name: newAdminUser.first_name,
            last_name: newAdminUser.last_name,
            email: newAdminUser.email,
            password_hash: password_hash,
            role: newAdminUser.role || 'admin', // Default to 'admin' role
            created_by: created_by
        };

        const user = await createAdminUser(adminUserData);
        res.status(201).send({ newAdminUser: user });
    } catch (err) {
        next(err);
    }
};

export const patchAdminUser = (req, res, next) => {
    const updatedAdminUser = req.body;
    const { admin_id } = req.params;
    
    // If password is being updated, hash it
    if (updatedAdminUser.password) {
        bcrypt.hash(updatedAdminUser.password, 10).then((password_hash) => {
            updatedAdminUser.password_hash = password_hash;
            delete updatedAdminUser.password;
            
            updateAdminUser(updatedAdminUser, admin_id).then((user) => {
                res.status(200).send({ admin_user: user });
            }).catch((err) => {
                next(err);
            });
        }).catch((err) => {
            next(err);
        });
    } else {
        updateAdminUser(updatedAdminUser, admin_id).then((user) => {
            res.status(200).send({ admin_user: user });
        }).catch((err) => {
            next(err);
        });
    }
};

export const deactivateAdmin = (req, res, next) => {
    const { admin_id } = req.params;
    deactivateAdminUser(admin_id).then((msg) => {
        res.status(200).send({ msg });
    }).catch((err) => {
        next(err);
    });
};

export const deleteAdminUser = (req, res, next) => {
    const { admin_id } = req.params;
    removeAdminUser(admin_id).then((msg) => {
        res.status(200).send({ msg });
    }).catch((err) => {
        next(err);
    });
};
