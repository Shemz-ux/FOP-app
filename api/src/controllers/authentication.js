import { fetchJobseekerByEmail } from "../models/jobseekers.js";
import { fetchSocietyByEmail } from "../models/societies.js";
import { generateToken } from "../lib/token.js";
import bcrypt from "bcrypt";

async function createToken(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // First, try to find a jobseeker with this email
    let user = null;
    let userType = null;
    let userId = null;

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
        // Society not found either
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

    // Generate token with user type and ID
    const token = generateToken(userId, userType);
    
    return res.status(201).json({ 
      token: token, 
      user_id: userId,
      user_type: userType,
      message: "OK" 
    });
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


const AuthenticationController = {
  createToken: createToken,
};

export default AuthenticationController;