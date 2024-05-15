import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { SubCategory } from "../models/subCategory.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Category } from "../models/category.models.js";


//For creating a new Subcategory 
const createNewSubCategory = asyncHandler( async (req, res) => {
    const {name, image, description, taxApplicability, tax, categoryId} = req.body;

    if(!isValidObjectId(categoryId)){
        throw new apiError(400, "Invalid Category ID");
    }

    const newSubCategory = await SubCategory.create({
        name: name,
        image: image,
        description: description,
        taxApplicability: taxApplicability,
        tax: tax,
        category: categoryId
    });

    const createdSubCategory = await SubCategory.findById(newSubCategory._id);

    if(!createdSubCategory){
        return res
            .status(500)
            .json(
                new apiResponse(
                    500,
                    {},
                    "Sub Category creation failed"
                )
            );
    }

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                createdSubCategory,
                "Sub Category created Successfully"
            )
        );
});

//For getting all Subcategories from subcategories collection
const getAllSubCategories = asyncHandler( async (req, res) => {
    const allSubCategories = await SubCategory.find({});

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            allSubCategories,
            "All Sub categories fetched successfully"
        )
    );
});

//For getting all subCategory associated with a Category
const getAllSubCategoriesForCategory = asyncHandler( async(req, res) => {
    const { categoryId } = req.params;

    if(!isValidObjectId(categoryId)){
        return res
            .status(400)
            .json(
                new apiResponse(
                    400,
                    {},
                    "Invalid Category ID"
                )
            );
    }

    const subcategories = await SubCategory.aggregate([
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
                subcategories,
                "Sub categories for a Category fetched successfully"
            )
        );
});

//For getting a Subcategory using 'name'
//NOTE: 'name' is case-sensitive
const getSubCategoryByName = asyncHandler( async (req, res) => {
    const { name } = req.params;

    const subCategory = await SubCategory.findOne({
        name: name
    });

    if(!subCategory){
        return res
            .status(404)
            .json(
               new apiResponse(
                    404,
                    {},
                    "Sub Category not found"
               )
            );
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            subCategory,
            "Sub category fetched successfully"
        )
    );
});

//For getting subcategory using ID
const getSubCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id);

    if(!subCategory){
        return res
            .status(404)
            .json(
               new apiResponse(
                    404,
                    {},
                    "Sub Category not found"
               )
            );
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            subCategory,
            "Sub category fetched successfully"
        )
    );
});

//For updating any attribute of subCategory
const updateSubCategory = asyncHandler( async(req, res) => {
    const { id } = req.params;
    const {name, image, description, taxApplicability, tax, category} = req.body;

    if(!isValidObjectId(id)){
        throw new apiError(400, "Invalid Sub Category ID");
    }

    if(category && !isValidObjectId(category)){
        throw new apiError(400, "Invalid Category ID");
    }

    const subCategory = await SubCategory.findById(id);

    if(!subCategory){
        return res
            .status(404)
            .json(
                new apiResponse(
                    404,
                    {},
                    "Sub Category not found" 
                )
            );
    }


    const update = {};
    if (name) update.name = name;
    if (image) update.image = image;
    if (description) update.description = description;
    if (taxApplicability !== undefined) update.taxApplicability = taxApplicability;
    if (tax !== undefined) update.tax = tax;
    if(category !== undefined) update.category = category;

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
        id,
        {
            $set: update
        },
        {
            new: true
        }
    );

    if(!updatedSubCategory){
        return res
        .status(500)
        .json(
            new apiResponse(
                500,
                {},
                "Sub Category attributes updation failed"
            )
        );
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedSubCategory,
                "Sub Category attributes updated successfully"
            )
        )
});

export {
    createNewSubCategory,
    getAllSubCategories,
    getAllSubCategoriesForCategory,
    getSubCategoryByName,
    getSubCategoryById,
    updateSubCategory
};