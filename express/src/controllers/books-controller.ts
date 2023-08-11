import type { RequestHandler } from 'express';
import prisma from '../data-context';
import HttpException from '../http-exception';
import updateBookDtoSchema from '../dtos/update-book-dto';
import createBookDtoSchema from '../dtos/create-book-dto';

const getBooks: RequestHandler = async (req, res, next) => {
    try {
        const books = await prisma.book.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        res.status(200).json(books);
    } catch (err) {
        next(HttpException.internal(null, err));
    }
};

const createBook: RequestHandler = async (req, res, next) => {
    try {
        const dto = createBookDtoSchema.safeParse(req.body);

        if (!dto.success) {
            return next(HttpException.malformedBody(null, dto.error.errors));
        }

        const { name, description } = dto.data;

        const book = await prisma.book.create({
            data: {
                name,
                description,
                authorId: req.userData?.id || '',
            },
            select: {
                id: true,
            },
        });

        if (!book) return next(HttpException.internal());

        const createBookResponse = {
            id: book.id,
        };

        res.status(201).json(createBookResponse);
    } catch (err) {
        next(HttpException.internal(null, err));
    }
};

const updateBook: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id;

        const book = await prisma.book.findUnique({ where: { id } });

        if (!book) return next(HttpException.notFound());

        if (book.authorId !== req.userData?.id) return next(HttpException.unauthorized());

        const dto = updateBookDtoSchema.safeParse(req.body);

        if (!dto.success) {
            return next(HttpException.malformedBody(null, dto.error.errors));
        }

        const { name, description } = dto.data;

        await prisma.book.update({
            where: {
                id: book.id,
            },
            data: {
                name: name ?? book.description,
                description: description ?? book.description,
            },
        });

        res.status(204).end();
    } catch (err) {
        next(HttpException.internal(null, err));
    }
};

export default {
    getBooks,
    createBook,
    updateBook,
};
