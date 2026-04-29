import { prisma } from "../config/db.js";
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

export const signAccessToken = (userId) => {
    return jwt.sign(
        { id: userId }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
};

export const generateRandomToken = () => {
    return randomBytes(32).toString('hex');
};


export const createSession = async (user, res) => {
    
    // 2. Generate Tokens
    const accessToken = signAccessToken(user.id);
    const refreshToken = generateRandomToken();
    
    const REFRESH_TOKEN_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

    // 3. Save Refresh Token to Database
    const session = await prisma.$transaction([
            prisma.authTransaction.deleteMany({
                where: { userId: user.id }
            }),
            prisma.authTransaction.create({
                data: {
                    userId: user.id,
                    refreshToken,
                    expiresAt: new Date(Date.now() + REFRESH_TOKEN_AGE)
                }
            })
        ]);
    

    // 4. Set Access Token Cookie
    res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hour
        sameSite: 'strict'
    });

    // 5. Set Refresh Token Cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: REFRESH_TOKEN_AGE,
        sameSite: 'strict',
        
    });

    return { accessToken, refreshToken };
};