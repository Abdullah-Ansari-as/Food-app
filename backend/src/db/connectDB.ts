import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(process.env.MONGO_URI!);
		console.log(`MongoDB connected !! DB HOST; ${connectionInstance.connection.host}`);
	} catch (error) {
		console.log("Failed to connect mongodb: ", error)
	}
}

export default connectDB;