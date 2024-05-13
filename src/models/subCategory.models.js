import mongoose, { Schema } from "mongoose";

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
            required: true
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

/**************************************
Pre hook or middleware hook to set default values of 
taxApplicability: Boolean, Default: Category's tax applicability 
tax: Number, Default: Category's tax number
This middleware function will execute before saving a new SubCategory document.
**************************************/

subCategorySchema.pre('save', async function (next) {
    const category = await mongoose.model('Category').findById(this.category);

    if(category){
        this.taxApplicability = this.taxApplicability || category.taxApplicability;
        this.tax = this.tax || category.tax;
    }

    next();
});

export const SubCategory = mongoose.model("subcategories", subCategorySchema);