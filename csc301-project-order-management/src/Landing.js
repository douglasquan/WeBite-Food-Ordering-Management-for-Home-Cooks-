import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import TransitionWrapper from "./components/TransitionWrapper/TransitionWrapper.jsx";

import Home from "./components/home/home.jsx";
import Customer from "./components/customer/customer.jsx";
import Chef from "./components/chef/chef.jsx";
import Login from "./components/login/login.jsx";
import Create_Account from "./components/login/CreateAccount.jsx";
import Forget_Password from "./components/login/ForgotPassword.jsx";
import ChefReviewPage from "./components/review/ChefReviewPage.jsx";
import CustomerReviewPage from "./components/review/CustomerReviewPage.jsx";
import ChefSummaryPage from "./components/summary/chef_summary.jsx";
import CustomerSummaryPage from "./components/summary/customer_summary.jsx";

import { useState, useEffect } from "react";
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
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

const ProtectedRoute = ({ children, user }) => {
  return user ? children : <Navigate to='/' />;
};

function App() {
  const { isChef, loading } = useIsChef();
  let location = useLocation(); // Use useLocation hook here
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await getReq("user/@me");
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
        setUser(null);
      }
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <TransitionWrapper locationKey={location.key}>
      <Routes location={location}>
        <Route path='/' element={<Home />} />
        <Route
          path='/menu'
          element={<ProtectedRoute user={user}>{isChef ? <Chef /> : <Customer />}</ProtectedRoute>}
        />
        <Route path='/login' element={<Login />} />
        <Route path='/create-account' element={<Create_Account />} />
        <Route path='/forgot-password' element={<Forget_Password />} />
        <Route
          path='/review'
          element={
            <ProtectedRoute user={user}>
              {isChef ? <ChefReviewPage /> : <CustomerReviewPage />}
            </ProtectedRoute>
          }
        />
        <Route
          path='/summary'
          element={
            <ProtectedRoute user={user}>
              {isChef ? <ChefSummaryPage /> : <CustomerSummaryPage />}
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </TransitionWrapper>
  );
}

export default AppWrapper;