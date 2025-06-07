import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  udpateUser,
} from "../controller/userController.js";

const router = Router();
// Users Routes

/**
 * @swagger
 * /users:
 *   tags:
 *     - name: Users
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Search for users by name
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of users per page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A list of users
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /user:
 *   tags:
 *     - name: Users
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the given information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - designation
 *               - empId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                 example: "john.doe@example.com"
 *               designation:
 *                 type: string
 *                 description: Job designation of the user
 *                 example: "Software Engineer"
 *               empId:
 *                 type: string
 *                 description: Employee ID of the user
 *                 example: "EMP123"
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       '400':
 *         description: Bad request - Invalid input or duplicate user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Email already exists"
 *                 key:
 *                   type: string
 *                   example: "email"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/user", createUser);

/**
 * @swagger
 * /user/{id}:
 *   tags:
 *     - name: Users
 *   put:
 *     summary: Update a user
 *     description: Updates an existing user with the given information
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                 example: "john.doe@example.com"
 *               designation:
 *                 type: string
 *                 description: Job designation of the user
 *                 example: "Software Engineer"
 *               empId:
 *                 type: string
 *                 description: Employee ID of the user
 *                 example: "EMP123"
 *     responses:
 *       '200':
 *         description: User updated successfully
 */
router.put("/user/:id", udpateUser);

/**
 * @swagger
 * /user/{id}:
 *   tags:
 *     - name: Users
 *   delete:
 *     summary: Delete a user
 *     description: Deletes an existing user with the given ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to delete
 *     responses:
 *       '200':
 *         description: User deleted successfully
 */
router.delete("/user/:id", deleteUser);

export default router;
