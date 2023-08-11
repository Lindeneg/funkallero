import express, { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth-router';
import booksRouter from './routes/books-router';
import HttpException from './http-exception';
import DBSeed from './data-context/seed';

const app: Express = express();

app.use(express.json());

app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.use('/api', authRouter);
app.use('/api/books', booksRouter);

app.use((error: HttpException | any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(error);

    if (error instanceof HttpException) {
        res.status(error.statusCode).json(error.toResponse());
    } else {
        res.status(500).json({
            message: 'Something went wrong. Please try again.',
        });
    }
});

await new DBSeed().seed({ reset: true });

app.listen(3000, () => {
    console.log('\nstarting express\n');
});
