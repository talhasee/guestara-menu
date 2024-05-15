import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

/****************************************************************************
    Pre hook to calculate 'totalAmount' before saving a new document
 ****************************************************************************/

itemSchema.pre('save', function (next) {
    this.totalAmount = this.baseAmount - this.discount;

    next();
});

/***************************************************************************
    Pre hook to update 'totalAmount' after a document is udpated
****************************************************************************/
itemSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    // If baseAmount or discount is being updated
    if (update.$set && (update.$set.baseAmount || update.$set.discount)) {
        let baseAmount = update.$set.baseAmount;
        let discount = update.$set.discount;

        // If baseAmount is not being updated, get the current value
        if (!baseAmount) {
            const doc = await this.model.findOne(this.getQuery());
            baseAmount = doc.baseAmount;
        }

        // If discount is not being updated, get the current value
        if (!discount) {
            const doc = await this.model.findOne(this.getQuery());
            discount = doc.discount;
        }

        // Calculate the new totalAmount
        update.$set.totalAmount = baseAmount - discount;
    }

    next();
});


/***************************************************************************
    For pagination of fuzzy search results 
****************************************************************************/
itemSchema.plugin(mongooseAggregatePaginate);

export const Item = mongoose.model("items", itemSchema);