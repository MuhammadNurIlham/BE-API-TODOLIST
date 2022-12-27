import express from "express";
import { getUsers, getUserById, addUser, updateUser, deleteUser } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', addUser);
router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken, getUserById);
router.patch('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);

export default router;