import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TransactionPage from "./pages/TransactionPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/ui/Header";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

function App() {
	const [hasToken, setHasToken] = useState(!!localStorage.getItem('authToken'));
	
	const { loading, data } = useQuery(GET_AUTHENTICATED_USER, {
		skip: !hasToken
	});

	// Listen for storage changes
	useEffect(() => {
		const handleStorageChange = () => {
			setHasToken(!!localStorage.getItem('authToken'));
		};
		
		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, []);

	const user = data?.authUser;

	if (loading) return <div>Loading...</div>;

	return (
		<>
			{user && <Header />}
			<Routes>
				<Route path='/' element={user ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
				<Route
					path='/transaction/:id'
					element={user ? <TransactionPage /> : <Navigate to='/login' />}
				/>
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
