
import express from 'express';
import checkAuth from '../middlewares/checkAuth.middleware.js';
import userControllers from '../Controllers/users.controllers.js';
//import routers from './users.routes.js';

const usersRouter = express.Router();

usersRouter.post('/register', userControllers.register);

// User Login
usersRouter.post('/login', userControllers.login);

// Get Current User (authenticated)
usersRouter.get('/me', checkAuth, userControllers.getMe);


export default usersRouter;