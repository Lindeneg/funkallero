import type { RequestHandler } from 'express';
import HTTPException from '../http-exception';
import { getAuthCookieFromRequest, verifyToken } from '../utils/auth';

export const authCheck: RequestHandler = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    } else {
        try {
            const cookie = getAuthCookieFromRequest(req);

            const decToken = await verifyToken(cookie);

            if (!decToken) return next(HTTPException.unauthorized('token could not be successfully verified'));

            req.userData = decToken;

            next();
        } catch (err) {
            next(HTTPException.internal(null, err));
        }
    }
};
