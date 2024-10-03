
import express from 'express';
import checkAuth from '../middlewares/checkAuth.middleware.js';
import userControllers from '../Controllers/users.controllers.js';

const routers = express.Router();

routers.post('/register', userControllers.register); // Correct usage for default export
routers.post('/login', userControllers.login);
routers.get('/me', checkAuth, userControllers.getMe);


export default routers;