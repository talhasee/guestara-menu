import { Router } from "express";
import {
    createNewItem,
    getAllItemsForCategory,
    getAllItemsForSubCategory,
    getItemById,
    getItemByName,
    itemSearch,
    updateItem
} from "../controllers/items.controller.js";

const router = Router();

router
.route("/")
.post(createNewItem);

router
.route("/")
.get(itemSearch);

router
.route('/all/it-c/:categoryId')
.get(getAllItemsForCategory);

router
.route("/all/it-sc/:subcategoryId")
.get(getAllItemsForSubCategory)

router
.route("/it-id/:itemId")
.get(getItemById);

router
.route("/it-name/:name")
.get(getItemByName);

router
.route("/it-update/:itemId")
.patch(updateItem);


export default router;