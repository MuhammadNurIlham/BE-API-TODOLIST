import express from "express";
import { addTodo, getTodos, getTodoId, updateTodo, deleteTodo } from "../controllers/todoController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', verifyToken, addTodo);
router.get('/', verifyToken, getTodos);
router.get('/:id', verifyToken, getTodoId);
router.patch('/:id', verifyToken, updateTodo);
router.delete('/:id', verifyToken, deleteTodo);

export default router;