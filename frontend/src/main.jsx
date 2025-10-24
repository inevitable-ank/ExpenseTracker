import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import GridBackground from "./components/ui/GridBackgroun.jsx";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Create HTTP link
const httpLink = createHttpLink({
	uri: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:5000/graphql",
});

// Create auth link to add JWT token to headers
const authLink = setContext((_, { headers }) => {
	// Get the authentication token from localStorage
	const token = localStorage.getItem('authToken');
	console.log('Auth link - Token from localStorage:', token ? 'Token exists' : 'No token');
	
	// Return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		}
	}
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<GridBackground>
				<ApolloProvider client={client}>
					<App />
				</ApolloProvider>
			</GridBackground>
		</BrowserRouter>
	</React.StrictMode>
);
