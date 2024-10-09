import express from 'express';
import adminControllers from '../Controllers/admin.controllers.js'; // Ensure this path is correct
import checkAuth from '../middlewares/checkAuth.middleware.js'; // If you want to protect some routes

const adminRouter = express.Router();

// Register admin
/**
 * @openapi
 * /admin/register:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Register Admin
 *     description: Admin registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The admin's username. *
 *               email:
 *                 type: string
 *                 description: The admin's email. *
 *               password:
 *                 type: string
 *                 description: The admin's password. *
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request
 */
adminRouter.post('/register', adminControllers.registerAdmin);

// Login admin
/**
 * @openapi
 * /admin/login:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Login Admin
 *     description: Admin login
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
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       400:
 *         description: Invalid credentials
 */
adminRouter.post('/login', adminControllers.loginAdmin);


// Export router
export default adminRouter;
