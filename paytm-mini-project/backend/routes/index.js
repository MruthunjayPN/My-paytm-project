import express from 'express';
import userRouter from './user.js'
import accountRouter from './account.js'

//router function in express 
//https://www.geeksforgeeks.org/express-js-express-router-function/
const router = express.Router();

router.use('/user', userRouter);
router.use('/account', accountRouter);

export default router