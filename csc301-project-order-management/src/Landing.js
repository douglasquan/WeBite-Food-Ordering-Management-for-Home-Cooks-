import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Home from "./components/home/home.jsx";
import Customer from "./components/customer/customer.jsx";
import Chef from "./components/chef/chef.jsx";
import Login from "./components/login/login.jsx";
import Create_Account from "./components/login/CreateAccount.jsx";
import Forget_Password from "./components/login/ForgotPassword.jsx";
import Cart from "./components/cart/cart.jsx";

import { useState, useEffect } from 'react';
import { getReq } from "./components/view_control";

// Custom hook to check if the user is a chef
// Custom hook to check if the user is a chef, including loading state
const useIsChef = () => {
    const [isChef, setIsChef] = useState(false); // Default to false or null based on your logic
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await getReq("/user/chef/is-chef");
                setIsChef(response.data.is_chef);
            } catch (error) {
                console.error("Error checking if user is a chef", error);
                setIsChef(false); // Adjust based on how you want to handle errors
            } finally {
                setLoading(false); // Ensure loading is set to false after fetching
            }
        };

        fetchRole();
    }, []); // Dependency array is empty, so this runs once on component mount

    return { isChef, loading }; // Return both isChef and loading states
};

function Landing() {
   const { isChef, loading } = useIsChef(); // Destructure both isChef and loading

    if (loading) {
        return <div>Loading...</div>; // Or any loading indicator you prefer
    }

    return (
        <>
            <Router>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/menu"
                        element={isChef ? <Chef /> : <Customer />}
                    />
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/" />}
                    />
                    <Route 
                        path="/create-account" 
                        element={<Create_Account />} 
                    />
                    <Route 
                        path="/forgot-password" 
                        element={<Forget_Password />} 
                    />
                    <Route 
                        path="/cart" 
                        element={<Cart />} 
                    />
                    <Route 
                        path="/review" 
                        element={isChef ? <ChefReviewPage /> :<CustomerReviewPage />}
                    />
                    <Route 
                        path="/review/chef" 
                        element={<ChefReviewPage />}
                    />
                </Routes>
            </Router>
        </>
    );
}
 
export default Landing;