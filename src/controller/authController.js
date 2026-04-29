import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

import { createSession } from "../utils/generateToken.js";
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check if user exists
        
        const userExists = await prisma.user.findUnique({
            where: { email: email }
        })

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 3. Hash password
        // You can pass the "salt rounds" directly to bcrypt.hash
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        // 5. Generate token
     
        const {accessToken, refreshToken} = await createSession(user, res);

        // 6. Success Response
       
        return res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token: accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
};

const login = async (req, res) => {
    // Implement login logic here
    const { email, password } = req.body;
    try {        
        // 1. Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        // 2. Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: email }
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // 3. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // 4. Generate token 
       
        const {accessToken, refreshToken} = await createSession(user, res);
       
       

        // 5. Success Response 
        return res.status(200).json({
            status: "success",
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    name: user.name,    
                    email: user.email
                },
                token: accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
}

const refreshToken = async (req, res) => {
    try {
        // The middleware already attached the user to req!
        const user = req.user;

        // We call the session logic here in the controller
       const {accessToken, refreshToken} = await createSession(user, res);
       
       

        // 5. Success Response 
        return res.status(200).json({
            status: "success",
            message: "Token refreshed successfully",
            data: {
                user: {
                    id: user.id,
                    name: user.name,    
                    email: user.email
                },
                token: accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error("Refresh Controller Error:", error);
        return res.status(500).json({ error: "Could not refresh session" });
    }
}
const logout = async (req, res) => {
    try {
        res.clearCookie("token", {  
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", 
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({       
            message: "Internal server error",
            error: error.message
        });
    }   
};


export { register, login, logout, refreshToken };