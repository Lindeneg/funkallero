import { Router } from 'express';
import { authCheck } from '../middleware/auth';
import booksController from '../controllers/books-controller';

const router = Router();

router.get('/', booksController.getBooks);

router.use(authCheck);

router.post('/', booksController.createBook);
router.patch('/:id', booksController.updateBook);

export default router;
