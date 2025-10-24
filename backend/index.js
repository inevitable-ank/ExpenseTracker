import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

import { connectDB } from "./db/connectDB.js";
import { verifyToken } from "./utils/jwt.js";
import User from "./models/user.model.js";

import job from "./cron.js";

dotenv.config();
job.start();

const __dirname = path.resolve();
const app = express();

const httpServer = http.createServer(app);

console.log("Environment:", process.env.NODE_ENV);
console.log("JWT Secret exists:", !!process.env.JWT_SECRET);


const server = new ApolloServer({
	typeDefs: mergedTypeDefs,
	resolvers: mergedResolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
	"/graphql",
	cors({
		origin: [
			process.env.FRONTEND_URL || "http://localhost:3000",
			"https://expense-tracker-w8v3.vercel.app"
		],
		credentials: true,
	}),
	express.json(),
	// expressMiddleware accepts the same arguments:
	// an Apollo Server instance and optional configuration options
	expressMiddleware(server, {
		context: async ({ req, res }) => {
			// JWT Authentication
			let user = null;
			const authHeader = req.headers.authorization;
			
			if (authHeader && authHeader.startsWith('Bearer ')) {
				const token = authHeader.substring(7);
				const decoded = verifyToken(token);
				
				if (decoded) {
					try {
						user = await User.findById(decoded.userId);
						console.log("JWT Authentication successful for user:", user?.username);
					} catch (error) {
						console.error("Error fetching user from JWT:", error);
					}
				} else {
					console.log("Invalid JWT token");
				}
			} else {
				console.log("No JWT token provided");
			}
			
			return {
				req,
				res,
				user,
				// Helper functions for resolvers
				getUser: () => user,
				login: async (userData) => {
					// This will be handled in the resolver
					return userData;
				},
				logout: () => {
					// JWT logout is handled on frontend by removing token
					return { message: "Logged out successfully" };
				}
			};
		},
	})
);

// Health check endpoint
app.get("/health", (req, res) => {
	res.json({ status: "OK", message: "Backend server is running" });
});

// Modified server startup
const PORT = process.env.PORT || 5000;
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
await connectDB();

console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
