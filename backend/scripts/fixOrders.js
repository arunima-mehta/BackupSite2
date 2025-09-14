import mongoose from "mongoose";
import 'dotenv/config';
import connectDB from "../config/mongodb.js";
import userModel from "../models/userModel.js";

const fixUsersOrders = async () => {
    try {
        await connectDB();
        console.log("Connected to database...");
        
        // Force update all users to have orders field
        const result = await userModel.updateMany(
            {},
            { $set: { orders: [] } },
            { upsert: false }
        );
        
        console.log(`Updated ${result.modifiedCount} users with orders field`);
        
        // Verify by checking users
        const users = await userModel.find({}).limit(3);
        console.log("Users after update:");
        users.forEach((user, index) => {
            console.log(`User ${index + 1}:`, {
                name: user.name,
                orders: user.orders,
                ordersType: typeof user.orders,
                isArray: Array.isArray(user.orders)
            });
        });
        
        // Also check the total count of users with orders field
        const usersWithOrders = await userModel.countDocuments({ orders: { $exists: true } });
        const totalUsers = await userModel.countDocuments({});
        
        console.log(`Users with orders field: ${usersWithOrders}/${totalUsers}`);
        
    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.connection.close();
    }
};

fixUsersOrders();