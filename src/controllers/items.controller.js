import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Category } from "../models/category.models.js";
import { Item } from "../models/items.models.js";
import { SubCategory } from "../models/subCategory.models.js";

//For creating a new Item
const createNewItem = asyncHandler (async (req, res) => {
    const {name, image, description, taxApplicability, tax, baseAmount, discount, categoryId, subCategoryId} = req.body;

    if(categoryId && !isValidObjectId(categoryId)){
        throw new apiError(400, "Invalid Category Id");
    }

    if(subCategoryId && !isValidObjectId(subCategoryId)){
        throw new apiError(400, "Invalid Sub Category ID");
    }

    const item = await Item.create(
        {
            name: name,
            image: image,
            description: description,
            taxApplicability: taxApplicability,
            tax: tax,
            baseAmount,
            discount: discount,
            category: categoryId,
            subCategory: subCategoryId
        }
    );

    if(!item){
        throw new apiError(500, "Error creating new item");
    }

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                item,
                "New Item created successfully"
            )
        );
});

//For getting all the items
const getAllItems = asyncHandler(async (req, res) => {
    const items = await Item.find({});

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                items,
                "All items fetched successfully"
            )
        )
});

//For Getting All Items associated with a category
const getAllItemsForCategory = asyncHandler (async (req, res) => {
    const { categoryId } = req.params;

    if(!isValidObjectId(categoryId)){
        throw new apiError(400, "Invalid category Id");
    }

    const category = await Category.findById(categoryId);

    if(!category){
        return res
            .status(404)
            .json(
                new apiResponse(
                    404,
                    {},
                    "Category does not exists"
                )
            );
    }

    const itemsForCategory = await Item.aggregate([
        {
            $match: {
                category: new mongoose.Types.ObjectId(categoryId)
            }
        }
    ]);


    return res 
        .status(200)
        .json(
            new apiResponse(
                200,
                itemsForCategory,
                "Items for a Category fetched successfully"
            )
        );
});

//For getting all the items associated with a subCategory
const getAllItemsForSubCategory = asyncHandler (async (req, res) => {
    const { subcategoryId } = req.params;

    if(!isValidObjectId(subcategoryId)){
        throw new apiError(400, "Invalid Sub category Id");
    }

    const subCategory = await SubCategory.findById(subcategoryId);

    if(!subCategory){
        return res
            .status(404)
            .json(
                new apiResponse(
                    404,
                    {},
                    "Sub Category does not exists"
                )
            );
    }

    //Pipeline for sorting out all the documents with subCategory as given subCategory from items collection
    const itemsForSubCategory = await Item.aggregate([
        {
            $match: {
                subCategory: new mongoose.Types.ObjectId(subcategoryId)
            }
        }
    ]);


    return res 
        .status(200)
        .json(
            new apiResponse(
                200,
                itemsForSubCategory,
                "Items for a Sub Category fetched successfully"
            )
        );
});

//For getting an item with its id
const getItemById = asyncHandler(async(req, res) => {
    const { itemId } = req.params;
   
    if(!isValidObjectId(itemId)){
        throw new apiError(400, "Invalid Item ID");
    }

    const item = await Item.findById(itemId);

    if(!item){
        return res
            .status(404)
            .json(
                new apiResponse(
                    404,
                    {},
                    "Item Does not exists"
                )
            );
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                item,
                "Item fetched successfully"
            )
        );
});

//For getting an item using its name
//NOTE: Here 'name' is case-sensitive
const getItemByName = asyncHandler (async(req, res) => {
    const { name } = req.params;

    const item = await Item.findOne({
        name: name
    });

    if(!item){
        return res
            .status(404)
            .json(
                new apiResponse(
                    404,
                    {},
                    "Item does not exists"
                )
            );
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                item,
                "Item fetched successfully"
            )
        );
});

//For updating any attribute of an item
const updateItem = asyncHandler(async(req, res) => {
    const { itemId } = req.params;
    const {name, image, description, taxApplicability, tax, baseAmount, discount, categoryId, subCategoryId} = req.body;

    if(!isValidObjectId(itemId)){
        throw new apiError(400, "Invalid Item id");;
    }

    if(categoryId && !isValidObjectId(categoryId)){
        throw new apiError(400, "Invalid category Id");
    }

    if(subCategoryId && !isValidObjectId(subCategoryId)){
        throw new apiError(400, "Invalid Sub Category Id");
    }

    const item = await Item.findById(itemId);

    if(!item){
        return res
            .status(404)
            .json(
                new apiResponse(
                    404,
                    {},
                    "Item does not exists"
                )
            );
    }

    const update = {};
    if (name) update.name = name;
    if (image) update.image = image;
    if (description) update.description = description;
    if (taxApplicability !== undefined) update.taxApplicability = taxApplicability;
    if (tax !== undefined) update.tax = tax;
    if (baseAmount) update.baseAmount = baseAmount;
    if (discount) update.discount = discount;
    if(categoryId !== undefined) update.category = categoryId;
    if (subCategoryId !== undefined) update.subCategory= subCategoryId;

    const updatedItem = await Item.findByIdAndUpdate(
        itemId,
        {
            $set: update
        },
        {
            new: true,
            runValidators: true
        }
    );

    if(!updatedItem){
        throw new apiError(500, "Error in updating Item Attributes");
    }


    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedItem,
                "Item attributes updated successfully"
            )
        );
});

//Fuzzy Searching of any item with its name
const itemSearch = asyncHandler(async(req, res) => {
    const {page = 1, limit = 10, query, sortBy, sortType} = req.query;

    const pipeline = [];

    //query generation by setting parameters for fuzzy search of items by their name
    if(query){
        pipeline.push({
            $search: {
                index: "item-search",
                text: {
                    query: query,
                    path: ["name"],
                    fuzzy: {
                        maxEdits: 2,
                        prefixLength: 0,
                        maxExpansions: 50
                    }
                }
            }
        });
    }


    if(sortBy && sortType){
        pipeline.push({
            $sort: {
                [sortBy]: sortType === 'asc' ? 1 : -1
            }
        });
    }
    else{
        pipeline.push({
            $sort: {
                createdAt: -1
            }
        });
    }

    const itemPipeline = Item.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const items = await Item.aggregatePaginate(itemPipeline, options);

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                items,
                "Items fetched successfully"
            )
        );
});

export {
    createNewItem,
    getAllItems,
    getAllItemsForCategory,
    getAllItemsForSubCategory,
    getItemById,
    getItemByName,
    updateItem,
    itemSearch
}