
import express from 'express';
import checkAuth from '../middlewares/checkAuth.middleware.js';
import userControllers from '../Controllers/users.controllers.js';
//import routers from './users.routes.js';

/**
 * @openapi
 * /users/register:
 *   post:
 *     tags:
 *       - Register
 *     summary: Đăng ký
 *     description: User registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */

const usersRouter = express.Router();
usersRouter.post('/register', userControllers.register);

// User Login
/**
 * @openapi
 * /users/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
usersRouter.post('/login', userControllers.login);

// Get Current User (authenticated)
/**
 * @openapi
 * /users/me:
 *   get:
 *     tags:
 *       - User
 *     summary: Lấy thông tin người dùng
 *     description: Get currently logged-in user information
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: User's ID
 *                 name:
 *                   type: string
 *                   description: User's name
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email address
 *       401:
 *         description: Unauthorized, user not logged in
 *       404:
 *         description: User not found
 */

usersRouter.get('/me', checkAuth, userControllers.getMe);

export default usersRouter;