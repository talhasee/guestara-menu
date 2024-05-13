import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema(
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
        baseAmount: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        totalAmount: {
            type: Number
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category"
        },
        subCategory: {
            type: Schema.Types.ObjectId,
            ref: "SubCategory"
        }
    },
    {
        timestamps: true
    }
);

itemSchema.pre('save', function (next) {
    this.totalAmount = this.baseAmount - this.discount;

    next();
});

export const Item = mongoose.model("items", itemSchema);