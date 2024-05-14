import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        // console.log(`\nMONGODB_URI - ${process.env.MONGODB_URI}\n`);
        // console.log(`\nMONGODB_PORT - ${process.env.PORT}\n`);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(`\nMongoDB connected!! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection failed!!", error);
        process.exit(1);
    }
}

export default connectDB;