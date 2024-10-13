import express from 'express';
import checkAuth from '../middlewares/checkAuth.middleware.js';
import userControllers from '../Controllers/users.controllers.js';

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

const usersRouter = express.Router();
usersRouter.post('/register', async (req, res) => {
    try {
        const result = await userControllers.register(req, res);
        return res.status(201).json({
            statusCode: 201,
            message: "User registered successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            statusCode: 400,
            message: error.message,
            data: {}
        });
    }
});

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
usersRouter.post('/login', async (req, res) => {
    try {
        const result = await userControllers.login(req, res);
        return res.status(200).json({
            statusCode: 200,
            message: "Login successfully",
            data: result
        });
    } catch (error) {
        return res.status(401).json({
            statusCode: 401,
            message: "Invalid credentials",
            data: {}
        });
    }
});

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
usersRouter.get('/me', checkAuth, async (req, res) => {
    try {
        const user = await userControllers.getMe(req, res);
        return res.status(200).json({
            statusCode: 200,
            message: "User information retrieved successfully",
            data: user
        });
    } catch (error) {
        return res.status(404).json({
            statusCode: 404,
            message: "User not found",
            data: {}
        });
    }
});

export default usersRouter;
