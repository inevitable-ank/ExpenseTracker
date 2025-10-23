import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { buildContext } from "graphql-passport";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

import { connectDB } from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";

import job from "./cron.js";

dotenv.config();
configurePassport();

job.start();

const __dirname = path.resolve();
const app = express();

const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
	uri: process.env.MONGO_URI,
	collection: "sessions",
});

store.on("error", (err) => console.log(err));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false, // this option specifies whether to save the session to the store on every request
		saveUninitialized: false, // option specifies whether to save uninitialized sessions
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true, // this option prevents the Cross-Site Scripting (XSS) attacks
		},
		store: store,
	})
);

app.use(passport.initialize());
app.use(passport.session());

// Global CORS middleware
app.use(cors({
	origin: [
		process.env.FRONTEND_URL || "http://localhost:3000",
		"https://expense-tracker-w8v3.vercel.app"
	],
	credentials: true,
}));

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
		context: async ({ req, res }) => buildContext({ req, res }),
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
