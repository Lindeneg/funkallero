import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type AuthModel from '../models/auth-model';

const cookieName = 'funkallero-auth-cookie';
const expiresIn = 7 * 24 * 60 * 60;
const secret = 'super-duper-secret';
const salt = 6;

export const createToken = async (payload: AuthModel): Promise<string> => {
    return jwt.sign(payload as Parameters<typeof jwt['sign']>[0], secret, {
        expiresIn: expiresIn,
    });
};

export const verifyToken = async (token: string): Promise<AuthModel | null> => {
    try {
        return jwt.verify(token, secret) as AuthModel;
    } catch (err) {
        console.log(err);
    }
    return null;
};

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

const createCookieString = (token: string) => {
    return `${cookieName}=${token}; Max-Age=${expiresIn}; Path=/; SameSite=Strict; HttpOnly=true;`;
};

export const getAuthCookieFromRequest = (req: Request) => {
    return req.cookies[cookieName];
};

export const setAuthCookieOnResponse = (res: Response, token: string): void => {
    res.setHeader('Set-Cookie', createCookieString(token));
};
