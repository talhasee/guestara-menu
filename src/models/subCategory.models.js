import mongoose, { Schema } from "mongoose";
import { Category } from "../models/category.models.js"
const subCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        taxApplicability: {
            type: Boolean,
        },
        tax: {
            type: Number,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category"
        }
    },
    {
        timestamps: true
    }
);

/********************************************************************************************
    Pre hook to set default values of 
    taxApplicability: Boolean, Default: Category's tax applicability 
    tax: Number, Default: Category's tax number
    This middleware function will execute before *****BEFORE SAVING A NEW***** SubCategory document.
*********************************************************************************************/

subCategorySchema.pre('save', async function (next) {
    //const category = await mongoose.model('Category').findById(this.category);

    const category = await Category.findById(this.category);
    
    if(category){
        this.taxApplicability = this.taxApplicability || category.taxApplicability;
        this.tax = this.tax || category.tax;
    }

    next();
});

/************************************************************************************************
    Pre hook to set default values of 
    taxApplicability: Boolean, Default: Category's tax applicability 
    tax: Number, Default: Category's tax number
    This middleware function will execute before *****UPDATING AN EXISTING DOCUMENT*** SubCategory document.
*************************************************************************************************/

subCategorySchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    // If taxApplicability or tax is being updated
    if (update.$set && (update.$set.taxApplicability === undefined || update.$set.tax === undefined)) {
        const category = await Category.findById(this.getQuery().category);

        if (category) {
            // If taxApplicability is being removed, set it to the Category's taxApplicability
            if (update.$set.taxApplicability === undefined) {
                update.$set.taxApplicability = category.taxApplicability;
            }

            // If tax is being removed, set it to the Category's tax
            if (update.$set.tax === undefined) {
                update.$set.tax = category.tax;
            }
        }
    }

    next();
});


export const SubCategory = mongoose.model("subcategories", subCategorySchema);