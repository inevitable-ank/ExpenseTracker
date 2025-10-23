import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildContext } from "graphql-passport";

import mergedResolvers from "../backend/resolvers/index.js";
import mergedTypeDefs from "../backend/typeDefs/index.js";
import { configurePassport } from "../backend/passport/passport.config.js";

// Configure passport
configurePassport();

const app = express();

// Session configuration for Vercel
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
	uri: process.env.MONGO_URI,
	collection: "sessions",
});

store.on("error", (err) => console.log(err));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		},
		store: store,
	})
);

app.use(passport.initialize());
app.use(passport.session());

// CORS configuration for Vercel
app.use(
	cors({
		origin: process.env.NODE_ENV === "production" 
			? [process.env.FRONTEND_URL, "https://your-app-name.vercel.app"]
			: "http://localhost:3000",
		credentials: true,
	})
);

app.use(express.json());

// Apollo Server setup
const server = new ApolloServer({
	typeDefs: mergedTypeDefs,
	resolvers: mergedResolvers,
});

// Start server
await server.start();

app.use(
	"/graphql",
	expressMiddleware(server, {
		context: async ({ req, res }) => buildContext({ req, res }),
	})
);

export default app;
