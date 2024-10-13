import express from 'express';
import adminControllers from '../Controllers/admin.controllers.js';
const usersRouter = express.Router();
/**
 * @openapi
 * /admins/register:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   additionalProperties: {}
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Bad request"
 *                 data:
 *                   type: object
 *                   additionalProperties: {}
 */


usersRouter.post('/register', adminControllers.registerAdmin);

// User Login
/**
 * @openapi
 * /admins/login:
 *   post:
 *     tags:
 *       - Authentication
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Login successfully"
 *                 data:
 *                   type: object
 *                   additionalProperties: {}
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *                 data:
 *                   type: object
 *                   additionalProperties: {}
 */
usersRouter.post('/login', adminControllers.loginAdmin);

// Get Current User (authenticated)
/**
 * @openapi
 * /admins/me:
 *   get:
 *     tags:
 *       - Admin
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
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "User information retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: User's ID
 *                     name:
 *                       type: string
 *                       description: User's name
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User's email address
 *       401:
 *         description: Unauthorized, user not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Unauthorized, user not logged in"
 *                 data:
 *                   type: object
 *                   additionalProperties: {}
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *                 data:
 *                   type: object
 *                   additionalProperties: {}
 */
usersRouter.get('/me', adminControllers.getMe);

export default usersRouter;
