import mongoose from "mongoose";
import 'dotenv/config';
import connectDB from "../config/mongodb.js";
import userModel from "../models/userModel.js";

// Migration script to ensure all existing users have required fields
const migrateUsers = async () => {
    try {
        await connectDB();
        console.log("Connected to database for migration...");
        
        // Get all users first
        const allUsers = await userModel.find({});
        console.log(`Total users in database: ${allUsers.length}`);
        
        // First, let's see what fields users currently have
        console.log("Checking current user field status...");
        const sampleUserBefore = await userModel.findOne({});
        console.log("Sample user before migration:", {
            name: sampleUserBefore?.name,
            cartData: sampleUserBefore?.cartData,
            wishlistData: sampleUserBefore?.wishlistData,
            orders: sampleUserBefore?.orders
        });
        
        // Update users to ensure they have cartData if missing
        await userModel.updateMany(
            { cartData: { $exists: false } },
            { $set: { cartData: {} } }
        );
        
        // Update users to ensure they have wishlistData if missing
        await userModel.updateMany(
            { wishlistData: { $exists: false } },
            { $set: { wishlistData: {} } }
        );
        
        // Update users to ensure they have orders array if missing
        await userModel.updateMany(
            { orders: { $exists: false } },
            { $set: { orders: [] } }
        );
        
        // Also fix any null or undefined values
        await userModel.updateMany(
            { $or: [
                { cartData: null },
                { wishlistData: null },
                { orders: null }
            ]},
            { $set: { 
                cartData: {},
                wishlistData: {},
                orders: []
            }}
        );
        
        console.log("Migration steps completed");
        
        // Verify the migration by checking users again
        const sampleUsersAfter = await userModel.find({}).limit(3);
        console.log("Sample users after migration:");
        sampleUsersAfter.forEach((user, index) => {
            console.log(`User ${index + 1}:`, {
                name: user.name,
                cartData: user.cartData,
                wishlistData: user.wishlistData,
                orders: user.orders,
                cartDataType: typeof user.cartData,
                wishlistDataType: typeof user.wishlistData,
                ordersType: typeof user.orders,
                ordersIsArray: Array.isArray(user.orders)
            });
        });
        
        console.log("✅ Migration completed successfully");
        
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        mongoose.connection.close();
        console.log("Database connection closed");
    }
};

// Run the migration
migrateUsers();