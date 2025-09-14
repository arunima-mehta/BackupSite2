import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, getUserActivity } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/profile', authUser, getUserProfile);
userRouter.post('/activity', authUser, getUserActivity);

export default userRouter;