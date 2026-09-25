import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return true;
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.warn('⚠️ MONGODB_URI not found in environment. Using local file storage fallback.');
        return false;
    }

    try {
        const conn = await mongoose.connect(uri);
        isConnected = true;
        console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.host}`);
        return true;
    } catch (err) {
        console.warn('⚠️ MongoDB connection warning:', err.message);
        isConnected = false;
        return false;
    }
};

export const isMongoConnected = () => isConnected;

export default connectDB;
