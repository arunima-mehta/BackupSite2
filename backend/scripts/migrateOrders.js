// Migration script to add orders field to existing users
// and migrate existing orders to user documents

import mongoose from 'mongoose';
import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';

const migrateOrdersToUsers = async () => {
    try {
        console.log('Starting orders migration...');

        // Get all users
        const users = await userModel.find({});
        console.log(`Found ${users.length} users`);

        for (const user of users) {
            // Get all orders for this user
            const userOrders = await orderModel.find({ userId: user._id });
            console.log(`User ${user.email} has ${userOrders.length} orders`);

            if (userOrders.length > 0) {
                // Convert orders to the format we want to store in user document
                const ordersForUser = userOrders.map(order => ({
                    orderId: order._id,
                    items: order.items,
                    amount: order.amount,
                    address: order.address,
                    paymentMethod: order.paymentMethod,
                    payment: order.payment,
                    status: order.status || "Order Placed",
                    date: order.date
                }));

                // Update user with orders array
                await userModel.findByIdAndUpdate(user._id, {
                    $set: { orders: ordersForUser }
                });

                console.log(`Updated user ${user.email} with ${ordersForUser.length} orders`);
            } else {
                // Ensure orders field exists even if empty
                await userModel.findByIdAndUpdate(user._id, {
                    $set: { orders: [] }
                });
                console.log(`Added empty orders array to user ${user.email}`);
            }
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    }
};

export default migrateOrdersToUsers;