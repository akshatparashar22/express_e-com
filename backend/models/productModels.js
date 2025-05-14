const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    name : {
        type: String,
        required: [true, "please enter prduct name"]
    },
    description : {
        type: String,
        required: [true, "please enter product description"]
    },
    price : {
        type: Number,
        required: [true, "please enter product price"]
        //Can add max price if required
    },
    rating : {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id : {
                type: String,
                required: true
            },
            url : {
                type: String,
                required: true
            }
        }
    ],
    category : {
        type : String,
        required: [true, "Please add product category"]
        //can add enum if reuired
    },
    stock : {
        type : Number,
        required: [true, "Please add product Stock"],
        default: 0,
    },
    numOfReviews : {
        type : Number,
        default: 0
    },
    reviews : [
        {
            name : {
                type: String, 
                required: true
            },
            rating : {
                type: String, 
                required: true  
            },
            comment : {
                type: String, 
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt : {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Product",productSchema)