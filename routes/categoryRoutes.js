import express from "express";
import { addCategory, getCategorys, getCategoryId, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', verifyToken, addCategory);
router.get('/', verifyToken, getCategorys);
router.get('/:id', verifyToken, getCategoryId);
router.patch('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

export default router;