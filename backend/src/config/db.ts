import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI; // Ensure this name matches your .env file's variable
    if (!dbUri) {
      throw new Error("MongoDB URI is not set in environment variables");
    }
    await mongoose.connect(dbUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
