import type { RequestHandler } from 'express';
import prisma from '../data-context';
import HttpException from '../http-exception';
import signupDtoSchema from '../dtos/signup-dto';
import loginDtoSchema from '../dtos/login-dto';
import { hashPassword, createToken, comparePassword, setAuthCookieOnResponse } from '../utils/auth';

const signup: RequestHandler = async (req, res, next) => {
    const dto = signupDtoSchema.safeParse(req.body);

    if (!dto.success) {
        return next(HttpException.malformedBody(null, dto.error.errors));
    }

    const { name, email, password } = dto.data;

    try {
        const existingAuthor = await prisma.author.findUnique({
            where: { email },
        });

        if (existingAuthor) return next(HttpException.unprocessable('user already exists in system'));

        const author = await prisma.author.create({
            data: {
                name,
                email,
                password: await hashPassword(password),
            },
        });

        if (!author) return next(HttpException.internal());

        const token = await createToken({ id: author.id, name: author.name });

        setAuthCookieOnResponse(res, token);

        res.status(201).json({
            id: author.id,
        });
    } catch (err) {
        next(HttpException.internal(null, err));
    }
};

const login: RequestHandler = async (req, res, next) => {
    const dto = loginDtoSchema.safeParse(req.body);

    if (!dto.success) {
        return next(HttpException.malformedBody(null, dto.error.errors));
    }

    const { email, password } = dto.data;

    const author = await prisma.author.findUnique({
        where: { email },
    });

    if (!author) return next(HttpException.notFound());

    const isValidPassword = await comparePassword(password, author.password);

    if (!isValidPassword) return next(HttpException.notFound());

    const token = await createToken({ id: author.id, name: author.name });

    setAuthCookieOnResponse(res, token);

    res.status(204).end();
};

export default {
    login,
    signup,
};
