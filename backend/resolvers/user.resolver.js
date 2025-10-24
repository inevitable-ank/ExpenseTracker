import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

const userResolver = {
	Mutation: {
		signUp: async (_, { input }, context) => {
			try {
				const { username, name, password, gender } = input;

				if (!username || !name || !password || !gender) {
					throw new Error("All fields are required");
				}
				const existingUser = await User.findOne({ username });
				if (existingUser) {
					throw new Error("User already exists");
				}

				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(password, salt);

				// https://avatar-placeholder.iran.liara.run/
				const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
				const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

				const newUser = new User({
					username,
					name,
					password: hashedPassword,
					gender,
					profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
				});

				await newUser.save();
				
				// Generate JWT token
				const token = generateToken(newUser._id);
				console.log("User signed up successfully:", newUser.username);
				
				return {
					user: newUser,
					token
				};
			} catch (err) {
				console.error("Error in signUp: ", err);
				throw new Error(err.message || "Internal server error");
			}
		},

		login: async (_, { input }, context) => {
			try {
				const { username, password } = input;
				if (!username || !password) throw new Error("All fields are required");
				
				// Find user and verify password
				const user = await User.findOne({ username });
				if (!user) {
					throw new Error("Invalid username or password");
				}
				
				const validPassword = await bcrypt.compare(password, user.password);
				if (!validPassword) {
					throw new Error("Invalid username or password");
				}
				
				// Generate JWT token
				const token = generateToken(user._id);
				console.log("User logged in successfully:", user.username);
				
				return {
					user,
					token
				};
			} catch (err) {
				console.error("Error in login:", err);
				throw new Error(err.message || "Internal server error");
			}
		},
		logout: async (_, __, context) => {
			try {
				// JWT logout is handled on frontend by removing token
				return { message: "Logged out successfully" };
			} catch (err) {
				console.error("Error in logout:", err);
				throw new Error(err.message || "Internal server error");
			}
		},
	},
	Query: {
		authUser: async (_, __, context) => {
			try {
				const user = await context.getUser();
				console.log("AuthUser query - User found:", user ? user.username : "No user");
				return user;
			} catch (err) {
				console.error("Error in authUser: ", err);
				throw new Error("Internal server error");
			}
		},
		user: async (_, { userId }) => {
			try {
				const user = await User.findById(userId);
				return user;
			} catch (err) {
				console.error("Error in user query:", err);
				throw new Error(err.message || "Error getting user");
			}
		},
	},
	User: {
		transactions: async (parent) => {
			try {
				const transactions = await Transaction.find({ userId: parent._id });
				return transactions;
			} catch (err) {
				console.log("Error in user.transactions resolver: ", err);
				throw new Error(err.message || "Internal server error");
			}
		},
	},
};

export default userResolver;
