import type { RequestHandler } from 'express';
import HttpException from '../http-exception';
import dataContext from '../data-context';
import updateBookDtoSchema from '../dtos/update-book-dto';
import createBookDtoSchema from '../dtos/create-book-dto';

const getBooks: RequestHandler = async (req, res, next) => {
    try {
        const books = await dataContext.Book.getAll();

        const booksResponse = await Promise.all(
            books.map(async (book) => {
                const author = await dataContext.Author.get(book.authorId);

                const bookDto = {
                    id: book.id,
                    name: book.name,
                    description: book.description,
                    author: { id: author?.id || '', name: author?.name || '' },
                };

                return bookDto;
            })
        );

        res.status(200).json(booksResponse);
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

        const book = dataContext.Book.new();

        book.name = name;
        book.description = description;
        book.authorId = req.userData?.id || '';
        book.createdAt = new Date();
        book.updatedAt = new Date();

        const createdBook = await dataContext.Book.create(book);

        if (!createdBook) return next(HttpException.internal());

        const createBookResponse = {
            id: createdBook.id,
        };

        res.status(201).json(createBookResponse);
    } catch (err) {
        next(HttpException.internal(null, err));
    }
};

const updateBook: RequestHandler = async (req, res, next) => {
    try {
        const bookId = req.params.id;

        const book = await dataContext.Book.get(bookId);

        if (!book) return next(HttpException.notFound());

        if (book.authorId !== req.userData?.id) return next(HttpException.unauthorized());

        const dto = updateBookDtoSchema.safeParse(req.body);

        if (!dto.success) {
            return next(HttpException.malformedBody(null, dto.error.errors));
        }

        const { name, description } = dto.data;

        book.name = name ?? book.description;
        book.description = description ?? book.description;
        book.updatedAt = new Date();

        const updatedBook = await dataContext.Book.update(bookId, book);

        if (!updatedBook) return next(HttpException.internal());

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
