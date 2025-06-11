import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  udpateUser,
} from "../controller/userController.js";
import {
  getProfile,
  login,
  logout,
  refreshToken,
  register,
} from "../controller/accountController.js";
import { verifyToken } from "../auth/auth.js";

const router = Router();

// Authentication Routes

/**
 * @openapi
 * /auth/register:
 *   post:
 *    tags:
 *    - Authentication
 *    summary: Register a new user
 *    description: Creates a new user account
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *              - firstName
 *              - lastName
 *              - confirmPassword
 *            properties:
 *              username:
 *                type: string
 *                description: Username of the user
 *                example: "john_doe"
 *              email:
 *                type: string
 *                format: email
 *                description: Email address of the user
 *                example: "john.doe@example.com"
 *              password:
 *                type: string
 *                description: Password of the user
 *                example: "password123"
 *              firstName:
 *                type: string
 *                description: First name of the user
 *                example: "John"
 *              lastName:
 *                type: string
 *                description: Last name of the user
 *                example: "Doe"
 *              confirmPassword:
 *                type: string
 *                description: Confirm password of the user
 *                example: "password123"
 *            example:
 *              username: "john_doe"
 *              email: "john.doe@example.com"
 *              firstName: "John"
 *              lastName: "Doe"
 *              password: ""
 *              confirmPassword: ""
 *    responses:
 *      '201':
 *        description: User created successfully
 *      '400':
 *        description: Bad request - Invalid input or duplicate user
 *      '500':
 *        description: Internal server error
 */
router.post("/auth/register", register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *    tags:
 *    - Authentication
 *    summary: Login a user
 *    description: Logs in a user with the given credentials
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                description: Username of the user
 *                example: "john_doe"
 *              password:
 *                type: string
 *                description: Password of the user
 *                example: "password123"
 *    responses:
 *      '200':
 *        description: User logged in successfully
 *      '400':
 *        description: Bad request - Invalid input or duplicate user
 */
router.post("/auth/login", login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *    tags:
 *    - Authentication
 *    summary: Logout a user
 *    description: Logs out a user
 *    responses:
 *      '200':
 *        description: User logged out successfully
 *      '400':
 *        description: Bad request - Invalid input or duplicate user
 */
router.post("/auth/logout", verifyToken, logout);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *    tags:
 *    - Authentication
 *    summary: Refresh a user's token
 *    description: Refreshes a user's token
 *    responses:
 *      '200':
 *        description: Token refreshed successfully
 */
router.post("/auth/refresh-token", verifyToken, refreshToken);

/**
 * @openapi
 * /profile:
 *   get:
 *    tags:
 *    - Authentication
 *    summary: Get a user's profile
 *    description: Returns a user's profile
 *    responses:
 *       '200':
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: ""
 *                     username:
 *                       type: string
 *                       example: ""
 *                     email:
 *                       type: string
 *                       example: ""
 *                     firstName:
 *                       type: string
 *                       example: ""
 *                     lastName:
 *                       type: string
 *                       example: ""
 *       '400':
 *         description: Bad request - Invalid input or duplicate user
 *       '500':
 *         description: Internal server error
 */
router.get("/profile", verifyToken, getProfile);

// Users Routes

/**
 * @openapi
 * /users:
 *  get:
 *    tags:
 *    - Users
 *    summary: Get all users
 *    description: Returns a list of all users
 *    responses:
 *      '200':
 *        description: A list of users
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: "Users fetched successfully"
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/CreateUser'
 *                pagination:
 *                  type: object
 *                  properties:
 *                    totalRecords:
 *                      type: integer
 *                      example: 100
 *                    page:
 *                      type: integer
 *                      example: 1
 *                    limit:
 *                      type: integer
 *                      example: 10
 *                    totalPages:
 *                      type: integer
 *                      example: 10
 *      '400':
 *        description: Bad request - Invalid input or duplicate user
 *      '500':
 *        description: Internal server error
 *    parameters:
 *      - name: search
 *        in: query
 *        description: Search for users by name
 *        required: false
 *        schema:
 *          type: string
 *      - name: page
 *        in: query
 *        description: Page number
 *        required: false
 *        schema:
 *          type: integer
 *      - name: limit
 *        in: query
 *        description: Number of users per page
 *        required: false
 *        schema:
 *          type: integer
 */
router.get("/users", verifyToken, getAllUsers);

/**
 * @openapi
 * /user:
 *   post:
 *    tags:
 *    - Users
 *    summary: Create a new user
 *    description: Creates a new user with the given information
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - email
 *              - designation
 *              - empId
 *            properties:
 *              name:
 *                type: string
 *                description: Full name of the user
 *                example: "John Doe"
 *              email:
 *                type: string
 *                format: email
 *                description: Email address of the user
 *                example: "john.doe@example.com"
 *              designation:
 *                type: string
 *                description: Job designation of the user
 *                example: "Software Engineer"
 *              empId:
 *                type: string
 *                description: Employee ID of the user
 *                example: "EMP123"
 *    responses:
 *      '201':
 *        description: User created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: "User created successfully"
 *      '400':
 *        description: Bad request - Invalid input or duplicate user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                error:
 *                  type: string
 *                  example: "Email already exists"
 *                key:
 *                  type: string
 *                  example: "email"
 *      '500':
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                error:
 *                  type: string
 *                  example: "Internal server error"
 */
router.post("/user", verifyToken, createUser);

/**
 * @openapi
 * /user/{id}:
 *   put:
 *    tags:
 *    - Users
 *    summary: Update a user
 *    description: Updates an existing user with the given information
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the user to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Full name of the user
 *                example: "John Doe"
 *              email:
 *                type: string
 *                format: email
 *                description: Email address of the user
 *                example: "john.doe@example.com"
 *              designation:
 *                type: string
 *                description: Job designation of the user
 *                example: "Software Engineer"
 *              empId:
 *                type: string
 *                description: Employee ID of the user
 *                example: "EMP123"
 *    responses:
 *      '200':
 *        description: User updated successfully
 */
router.put("/user/:id", verifyToken, udpateUser);

/**
 * @openapi
 * /user/{id}:
 *   delete:
 *    tags:
 *    - Users
 *    summary: Delete a user
 *    description: Deletes an existing user with the given ID
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the user to delete
 *    responses:
 *      '200':
 *        description: User deleted successfully
 */
router.delete("/user/:id", verifyToken, deleteUser);

export default router;
