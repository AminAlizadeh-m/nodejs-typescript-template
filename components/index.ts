import express, { NextFunction, Request, Response } from 'express';
const mainRouter = express.Router();

mainRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello world!');
});

export default mainRouter;
