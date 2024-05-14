import { Router } from "express";
import {
    createNewCategory,
    getAllCategories,
    getCategoryByName,
    getCategoryById,
    updateCategory
} from "../controllers/category.controller.js";

const router = Router();

router
.route('/')
.post(createNewCategory);

router
.route('/all')
.get(getAllCategories)

router
.route('/c-name/:name')
.get(getCategoryByName);

router
.route('/c-id/:id')
.get(getCategoryById);

router
.route('/c-update/:id')
.patch(updateCategory)

export default router;