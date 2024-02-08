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
                </Routes>
            </Router>
        </>
    );
}
 
export default Landing;