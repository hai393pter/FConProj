import express from 'express';
import checkAuth from '../middlewares/checkAuth.middleware.js';
import adminControllers from '../Controllers/admin.controllers.js';
const routers = express.Router();

routers.post('/signup', adminControllers.adminRegister);
routers.post('/login', adminControllers.adminLogin);
routers.get('/me', checkAuth, adminControllers.getMe);

export default routers;