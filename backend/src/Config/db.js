// Config/db.js
import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      retryWrites: true,
      w: "majority",
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      autoIndex: true,
      bufferCommands: false,
    });
    console.log("Connected to MongoDB Atlas");

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected, attempting to reconnect...");
      setTimeout(connectToDB, 5000);
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectToDB;
