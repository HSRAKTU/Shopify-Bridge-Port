import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId:{
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: String,
            default: "Not Processed",
            enum: ["Not Processed", "Processing", "Shipped", "Delivered", "Canceled"],
        },
        paymentStatus:{
            type: String,
            required: true
        },
        fulfillmentStatus:{
            type: String,
            required: true
        },
    }
,{ timestamps:true })

export const Order = mongoose.model("Order", orderSchema)

