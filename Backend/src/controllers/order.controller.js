import { Order } from "../models/order.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from "axios";

const getAllOrders = asyncHandler(async (req,res) => {
    const orders = await Order.find();
    return res
    .status(200)
    .json(new ApiResponse(200, orders, 'Fetched all orders successfully'));
})

const getOrderById = asyncHandler(async (req, res) => {

    let { orderID } = req.body;
    //check for orderId from Shopify REST API
    //If available fetch data
    //Check for fulfillment status
    //Push orderID, And other Status to DB
    //Serve it on bridge API endpoint

    if(!orderID) {
        console.log("orderID:", orderID)
        throw new ApiError(400, `Invalid Order ID `);
    }
    else{
        console.log("OrderID:",orderID);
        let orderResponse;
        try {
            orderResponse = await axios(
                {
                    method: 'GET',
                    url: 'https://checkout.surfacemoto.com/admin/api/2024-04/orders.json?status=any',
                    headers:{
                        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
                    }
                }
            )

            
        } catch (error) {
            console.log("error")
        }

        console.log("Searching order by ID")
        const order = findOrderByName(orderResponse.data.orders, orderID)
        if(!order){
            throw new ApiError(400, "Order Not found");
        }
        else{
            // fetch other details of order from DB by ID and add it to orderStatus
            const orderFromDb = await Order.findOne({ orderId: order.name });
            if (!orderFromDb) {
                throw new ApiError(400, "Order details not found in DB");
            }
            const orderStatus = {
                fulfillment_status: order.fulfillment_status,
                financial_status: order.financial_status,
                shipping_status: orderFromDb.status
            }
            return res
            .status(200)
            .json(new ApiResponse(200, orderStatus,"Serving Order Details"))
        }
        
    }    
})

const updateOrdersInDB = asyncHandler(async (req, res) =>{
    try {
        const shopifyResponse = await axios({
            method: 'GET',
            url: 'https://checkout.surfacemoto.com/admin/api/2024-04/orders.json?status=any',
            headers: {
                'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
            }
        });
        const orders = shopifyResponse.data.orders;

        for (let shopifyOrder of orders) {
            // const existingOrder = await Order.findOne({ name : shopifyOrder.name});
            // if(existingOrder){
            //     await Order.updateOne()
            // }else{

            // }
            const updateFields = {
                orderId: shopifyOrder.name,
                paymentStatus: shopifyOrder.financial_status, // Adjust field name based on your schema
                fulfillmentStatus: shopifyOrder.fulfillment_status // Adjust field name based on your schema
            };
            await Order.updateOne(
                { orderId: shopifyOrder.name },
                { $set: updateFields },
                { upsert: true } // This option creates a new document if no document matches the query
            );
        }
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "Orders updated successfully"));
    } catch (error) {
        console.log("Error while updating orders in DB");
        throw new ApiError(505, "Failed to update orders in DB !!");
    }
})

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderIds, status } = req.body;

    if (!orderIds || !status) {
        throw new ApiError(400, 'Order IDs and status are required');
    }

    await Order.updateMany({ orderId: { $in: orderIds } }, { status });

    return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Order statuses updated successfully'));
});


export {
    getOrderById,
    updateOrdersInDB,
    getAllOrders,
    updateOrderStatus
}

const findOrderByName = (orders, name) => {
    return orders.find(order => order.name === name);
  };
  