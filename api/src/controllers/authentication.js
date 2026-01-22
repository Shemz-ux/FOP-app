import { fetchJobseekerByEmail } from "../models/jobseekers.js";
import { fetchSocietyByEmail } from "../models/societies.js";
import { fetchAdminUserByEmail, updateLastLogin } from "../models/admin-users.js";
import { generateToken } from "../lib/token.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { storeResetToken, findUserByResetToken, updatePasswordAndClearToken } from "../models/password-reset.js";
import { sendPasswordResetEmail } from "../services/emailService.js";

async function createToken(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Try to find user in all three user types: jobseekers, societies, admin_users
    let user = null;
    let userType = null;
    let userId = null;
    let userRole = null;

    // First, try to find a jobseeker with this email
    try {
      user = await fetchJobseekerByEmail(email);
      if (user) {
        userType = 'jobseeker';
        userId = user.jobseeker_id;
      }
    } catch (err) {
      // Jobseeker not found, continue to check societies
    }

    // If no jobseeker found, try to find a society with this email
    if (!user) {
      try {
        user = await fetchSocietyByEmail(email);
        if (user) {
          userType = 'society';
          userId = user.society_id;
        }
      } catch (err) {
        // Society not found, continue to check admin users
      }
    }

    // If no jobseeker or society found, try to find an admin user with this email
    if (!user) {
      try {
        user = await fetchAdminUserByEmail(email);
        if (user) {
          userType = 'admin';
          userId = user.admin_id;
          userRole = user.role; // 'admin' or 'super_admin'
        }
      } catch (err) {
        // Admin user not found either
      }
    }

    if (!user) {
      console.log("Auth Error: User not found");
      return res.status(401).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      console.log("Auth Error: Passwords do not match");
      return res.status(401).json({ message: "Password incorrect" });
    }

    // Update last login for admin users
    if (userType === 'admin') {
      await updateLastLogin(userId);
    }

    // Generate token with user type, ID, and role (for admin users)
    const token = generateToken(userId, userType, userRole);
    
    // Extract user name based on user type
    let userName = null;
    if (userType === 'jobseeker') {
      userName = `${user.first_name} ${user.last_name}`;
    } else if (userType === 'society') {
      userName = user.name;
    } else if (userType === 'admin') {
      console.log('Auth - Admin user data:', { first_name: user.first_name, last_name: user.last_name });
      userName = `${user.first_name} ${user.last_name}`;
      console.log('Auth - Admin userName constructed:', userName);
    }
    
    const response = { 
      token: token, 
      user_id: userId,
      user_type: userType,
      name: userName,
      message: "OK" 
    };
    
    // Include first_name for admin users
    if (userType === 'admin') {
      response.first_name = user.first_name;
    }
    
    console.log('Auth - Response being sent:', response);

    // Include role in response for admin users
    if (userRole) {
      response.role = userRole;
    }
    
    return res.status(201).json(response);
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const result = await storeResetToken(email, tokenHash, expiresAt);

    if (result) {
      await sendPasswordResetEmail(email, resetToken);
    }

    return res.status(200).json({ 
      message: "If that email exists in our system, we've sent a password reset link." 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(200).json({ 
      message: "If that email exists in our system, we've sent a password reset link." 
    });
  }
}

async function resetPassword(req, res) {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Token, new password, and confirm password are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await findUserByResetToken(tokenHash);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    if (new Date() > new Date(user.password_reset_expires_at)) {
      return res.status(400).json({ message: "Reset token has expired" });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const success = await updatePasswordAndClearToken(user.user_id, user.userType, newPasswordHash);

    if (!success) {
      return res.status(500).json({ message: "Failed to update password" });
    }

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const AuthenticationController = {
  createToken: createToken,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
};

export default AuthenticationController;