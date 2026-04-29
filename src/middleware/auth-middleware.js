import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";


const authMiddleware = async (req, res, next) => {
    console.log("Auth Middleware: Checking authentication...");

    let token;

    // 1. Check for token in Cookies OR Authorization Header
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        console.log("Auth Middleware: Token found in cookies", token);
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
        console.log("Auth Middleware: Token found in Bearer header", token);
    }

    // 2. If no token found in either place, block the request
    if (!token) {
        console.log("Auth Middleware: No token provided");
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Fetch user from database
        // Ensure you use decoded.id (matching your generateToken payload)
        const user = await prisma.user.findUnique({ 
            where: { id: decoded.id },
            select: { id: true, email: true, name: true } // Don't fetch the password!
        });

        if (!user) {
            console.log("Auth Middleware: User not found in database");
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        // 5. Attach user to request object
        req.user = user;
        console.log("Auth Middleware: User authenticated");
        
        next(); // Move to the next controller
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        
        // Handle specifically for expired tokens
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Unauthorized: Token has expired" });
        }
        
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

const refreshTokenMiddleware = async (req, res, next) => {
    const accessToken = req.cookies?.token;
    const refreshToken = req.cookies?.refreshToken;

    // 1. If NEITHER available -> Exit
    if (!accessToken && !refreshToken) {
        return res.status(401).json({ error: "Unauthorized: No session found" });
    }
    
    try {
        let userId;

        // 2. Identify the user
        if (accessToken) {
            // We decode the JWT to get the ID, even if expired
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET, { ignoreExpiration: true });
            userId = decoded.id;
        } else if (refreshToken) {
            // If no access token, look up the refresh token in the database
            const session = await prisma.authTransaction.findUnique({
                where: { refreshToken },
                select: { userId: true }
            });
            userId = session?.userId;
        }

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: Session invalid" });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        // 3. Hand the user to the controller
        req.user = user;
        next();
        
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ error: "Session invalid. Please login again." });
    }
}


export { authMiddleware, refreshTokenMiddleware };