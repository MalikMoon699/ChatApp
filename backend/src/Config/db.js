import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://malikmoondeveloper061:tCuCF1t8PfTwE0ia@chatapp.7pjufy8.mongodb.net/ChatApp",
      {
        retryWrites: true,
        w: "majority",
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
      }
    );
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectToDB;
