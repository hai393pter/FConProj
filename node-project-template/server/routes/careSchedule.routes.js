// Routes/careSchedule.routes.js
import express from 'express';
import {
  createCareSchedule,
  getAllCareSchedules,
  getCareScheduleById,
  updateCareSchedule,
  deleteCareSchedule
} from '../Controllers/careSchedule.controllers.js';

const careRouter = express.Router();

/**
 * @openapi
 * openapi: 3.0.0
 * info:
 *   title: Lịch chăm sóc cây
 *   version: 1.0.0
 *   description: Lịch chăm sóc cây
 * 
 * components:
 *   schemas:
 *     CareSchedule:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 2
 *         task_date:
 *           type: string
 *           format: date-time
 *           example: "2024-10-10T10:00:00Z"
 *         task_type:
 *           type: string
 *           example: "Watering"
 *         notes:
 *           type: string
 *           example: "Use room temperature water"
 * 
 * paths:
 *   /careschedules:
 *     post:
 *       summary: Tạo lịch mới
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 product_id:
 *                   type: integer
 *                   example: 2
 *                 task_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-10T10:00:00Z"
 *                 task_type:
 *                   type: string
 *                   example: "Watering"
 *                 notes:
 *                   type: string
 *                   example: "Use room temperature water"
 *       responses:
 *         201:
 *           description: Lịch chăm sóc đã được tạo
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CareSchedule'
 *         400:
 *           description: Invalid input
 *         500:
 *           description: Server error
 *     get:
 *       summary: Xem tất cả lịch
 *       responses:
 *         200:
 *           description: Danh sách các lịch chăm sóc
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CareSchedule'
 *         500:
 *           description: Server error
 * 
 *   /careschedules/{id}:
 *     get:
 *       summary: Xem lịch chăm sóc dựa trên mã lịch
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Mã lịch
 *           schema:
 *             type: integer
 *       responses:
 *         200:
 *           description: Lịch chăm sóc
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CareSchedule'
 *         404:
 *           description: Không tìm thấy lịch chăm sóc
 *         500:
 *           description: Server error
 * 
 *     put:
 *       summary: Cập nhật lịch chăm sóc theo mã lịch
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Mã lịch cần cập nhật
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 plant_id:
 *                   type: integer
 *                   example: 2
 *                 schedule_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-10T10:00:00Z"
 *                 task:
 *                   type: string
 *                   example: "Watering"
 *                 notes:
 *                   type: string
 *                   example: "Use room temperature water"
 *       responses:
 *         200:
 *           description: Lịch đã được cập nhật
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CareSchedule'
 *         404:
 *           description: Không tìm thấy lịch
 *         500:
 *           description: Server error
 * 
 *     delete:
 *       summary: Xóa lịch chăm sóc dựa theo mã lịch
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Mã lịch cần xóa
 *           schema:
 *             type: integer
 *       responses:
 *         200:
 *           description: Lịch đã được xóa
 *         404:
 *           description: Không tìm thấy lịch
 *         500:
 *           description: Server error
 */

careRouter.post('/', createCareSchedule);

careRouter.get('/', getAllCareSchedules);

careRouter.get('/:id', getCareScheduleById);

careRouter.put('/:id', updateCareSchedule);

careRouter.delete('/:id', deleteCareSchedule);

export default careRouter;
