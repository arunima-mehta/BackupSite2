import mongoose from "mongoose";
import 'dotenv/config';
import connectDB from "../config/mongodb.js";
import userModel from "../models/userModel.js";

const testDatabaseUpdates = async () => {
    try {
        await connectDB();
        console.log("Connected to database for testing...");
        
        // Get a user to test with
        const testUser = await userModel.findOne({});
        if (!testUser) {
            console.log("No users found in database");
            return;
        }
        
        console.log(`Testing with user: ${testUser.name} (${testUser._id})`);
        console.log("Current cartData:", testUser.cartData);
        console.log("Current wishlistData:", testUser.wishlistData);
        
        // Test cart update
        console.log("\n--- Testing cart update ---");
        const testCartData = {
            "test_item_1": { "S": 2, "M": 1 },
            "test_item_2": { "L": 3 }
        };
        
        await userModel.findByIdAndUpdate(testUser._id, { cartData: testCartData });
        
        // Verify cart update
        const updatedUser1 = await userModel.findById(testUser._id);
        console.log("Updated cartData:", updatedUser1.cartData);
        
        // Test wishlist update
        console.log("\n--- Testing wishlist update ---");
        const testWishlistData = {
            "test_item_1": true,
            "test_item_3": true
        };
        
        await userModel.findByIdAndUpdate(testUser._id, { wishlistData: testWishlistData });
        
        // Verify wishlist update
        const updatedUser2 = await userModel.findById(testUser._id);
        console.log("Updated wishlistData:", updatedUser2.wishlistData);
        
        // Test adding to existing cart data
        console.log("\n--- Testing cart item addition ---");
        const userData = await userModel.findById(testUser._id);
        let cartData = userData.cartData;
        
        // Add a new item like the controller does
        const itemId = "new_test_item";
        const size = "M";
        
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        
        await userModel.findByIdAndUpdate(testUser._id, { cartData });
        
        // Verify addition
        const updatedUser3 = await userModel.findById(testUser._id);
        console.log("After adding new item:", updatedUser3.cartData);
        
        console.log("\n✅ Database update tests completed");
        
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        mongoose.connection.close();
        console.log("Database connection closed");
    }
};

testDatabaseUpdates();