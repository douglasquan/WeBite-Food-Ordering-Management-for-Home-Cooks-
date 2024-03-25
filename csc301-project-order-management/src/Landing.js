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
import Location from "./components/location/location.jsx";
 
function Landing() {
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
                        path="/customer"
                        element={<Customer />}
                    />
                    <Route
                        path="/chef"
                        element={<Chef />}
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
                        path="/location"
                        element={<Location />}
                    />
                </Routes>
            </Router>
        </>
    );
}
 
export default Landing;