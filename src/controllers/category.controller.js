import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Category } from "../models/category.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { isValidObjectId } from "mongoose";

const createNewCategory = asyncHandler ( async (req, res) => {
    try {
        const {name, imageUrl, description, taxApplicability, tax, taxType} = req.body;

        // console.log(`name - ${name}\nimageUrl - ${imageUrl}\ndescription - ${description}\ntaxApplicability - ${taxApplicability}\ntax - ${tax}\ntaxType - ${taxType}`);

        const newCategory = await Category.create({
            name: name,
            image: imageUrl,
            description: description,
            taxApplicability: taxApplicability,
            tax: tax,
            taxType: taxType
        });

        // console.log(JSON.stringify(newCategory));

        const createdCategory = await Category.findById(newCategory._id);

        if(!createdCategory){
            throw new apiError(500, "Something went wrong while creating category");
        }

        return res
            .status(201)
            .json(
                new apiResponse(
                    201,
                    createdCategory,
                    "Category Created Successfully"
                )
            );
    } catch (error) {
        throw new apiError(500,"Error creating new Category");
    }
});


const getAllCategories = asyncHandler (async (req, res) => {
    const allCategories = await Category.find({});

    return res
        .status(200)
        .json(
            new apiResponse(
                200, 
                allCategories,
                "All Categories fetched successfully"
            )
        );
});

const getCategoryByName = asyncHandler( async (req, res) => {
    const { name }= req.params;

    const category = await Category.findOne({
        name: name
    });

    if(!category){
        return res
            .status(404)
            .json(
                new apiResponse(
                    404,
                    {},
                    "Category not found"
                )
            );
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            category,
            "Category found successfully",
        )
    );
});


const getCategoryById = asyncHandler( async (req, res) => {
    const { id }= req.params;

    if(!isValidObjectId(id)){
        throw apiError(400, "Invalid Category ID");
    }

    const category = await Category.findById(id);

    if(!category){
        return res
            .status(404)
            .json(
                new apiResponse(
                    404,
                    {},
                    "Category not found"
                )
            );
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            category,
            "Category found successfully",
        )
    );
});


const updateCategory = asyncHandler( async(req, res) => {
    const { id } = req.params;
    const {name, imageUrl, description, taxApplicability, tax, taxType} = req.body;

    if(!isValidObjectId(id)){
        throw apiError(400, "Invalid Category ID");
    }

    const category = await Category.findById(id);

    if(!category){
        return res
        .status(404)
        .json(
            new apiResponse(
                404,
                {},
                "Category not found"
            )
        );
    }

    const update = {};
    if (name) update.name = name;
    if (imageUrl) update.image = imageUrl;
    if (description) update.description = description;
    if (taxApplicability !== undefined) update.taxApplicability = taxApplicability;
    if (tax !== undefined) update.tax = tax;
    if (taxType) update.taxType = taxType;

    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        {
            $set: update
        },
        {
            new: true
        }
    );


    if(!updatedCategory){
        return res
        .status(500)
        .json(
            new apiResponse(
                500,
                {},
                "Category attributes updation failed"
            )
        );
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedCategory,
                "Category attributes updated successfully"
            )
        )
});


export {
    createNewCategory,
    getAllCategories,
    getCategoryByName,
    getCategoryById,
    updateCategory
}