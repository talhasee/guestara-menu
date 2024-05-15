import { Router } from "express";
import {
    createNewSubCategory,
    getAllSubCategories,
    getAllSubCategoriesForCategory,
    getSubCategoryById,
    getSubCategoryByName,
    updateSubCategory
} from "../controllers/subCategory.controller.js";

const router = Router();

router
.route('/')
.post(createNewSubCategory);

router
.route('/all')
.get(getAllSubCategories);

router
.route('/all/:categoryId')
.get(getAllSubCategoriesForCategory);

router
.route('/sc-name/:name')
.get(getSubCategoryByName);

router
.route('/sc-id/:id')
.get(getSubCategoryById)

router
.route('/sc-update/:id')
.patch(updateSubCategory);

export default router;