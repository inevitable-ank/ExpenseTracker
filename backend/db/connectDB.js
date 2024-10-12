import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		console.log(`MongoDB URI: ${process.env.MONGO_URI}`)
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (err) {
		console.error(`Error: ${err.message}`);
		process.exit(1);
	}
};
