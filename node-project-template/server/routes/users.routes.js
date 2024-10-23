
import express from 'express';
import checkAuth from '../middlewares/checkAuth.middleware.js';
import userControllers from '../Controllers/users.controllers.js';
//import routers from './users.routes.js';
const usersRouter = express.Router();
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


usersRouter.post('/register', userControllers.register);

// User Login
/**
 * @openapi
 * /users/login:
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


/**
 * @openapi
 * /users/change-password:
 *   post:
 *     tags:
 *       - User
 *     summary: Change password for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Request body for changing password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized, token missing
 */
usersRouter.post('/change-password', checkAuth, userControllers.changePassword);

/**
 * @openapi
 * /users/forgot-password:
 *   post:
 *     summary: Quên mật khẩu
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Email đặt lại mật khẩu đã được gửi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                   example: Email đặt lại mật khẩu đã được gửi
 *       404:
 *         description: Không tìm thấy người dùng với email này
 *       500:
 *         description: Server error
 */
usersRouter.post('/forgot-password', userControllers.forgotPassword);

/**
 * @openapi
 * /users/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: 32-character-reset-token
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Mật khẩu đã được đặt lại thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                   example: Mật khẩu đã được đặt lại thành công
 *       400:
 *         description: Token không hợp lệ hoặc đã hết hạn
 *       500:
 *         description: Server error
 */
usersRouter.post('/reset-password', userControllers.resetPassword);

/**
 * @openapi
 * /users/update-info:
 *   put:
 *     summary: Cập nhật thông tin người dùng    
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               address:
 *                 type: string
 *                 example: 92/1C Cong Hoa, Go Vap
 *               phone:
 *                 type: string
 *                 example: "0982173134"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                   example: Thông tin người dùng đã được cập nhật thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     address:
 *                       type: string
 *                     phone:
 *                       type: string
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Server error
 */
usersRouter.put('/update-info', checkAuth, userControllers.updateUserInfo);



export default usersRouter;