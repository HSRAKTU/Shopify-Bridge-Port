import { Router } from "express";
import { getAllOrders, getOrderById, updateOrderStatus, updateOrdersInDB } from "../controllers/order.controller.js";

const router = new Router();

router.route('/order-status').post(getOrderById);

//Admin Routes
router.route('/update-db').post(updateOrdersInDB);
router.get('/all-orders', getAllOrders);
router.put('/update-status', updateOrderStatus);

export default router;