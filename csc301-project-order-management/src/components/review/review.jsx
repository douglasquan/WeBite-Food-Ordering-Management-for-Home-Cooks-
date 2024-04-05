import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from "../csc301-project-order-management/src/components/navbar/Navbar.jsx";
import ChefReviewPage from './ChefReviewPage.jsx';
import CustomerReviewPage from './CustomerReviewPage.jsx';

function Review() {
    return (
      <div>
        <Navbar />
        {/* If you have a local navbar or controls specific to the review section, they can go here */}
        <Routes>
          <Route path="chef-reviews" element={<ChefReviewPage />} />
          <Route path="write-review" element={<CustomerReviewPage />} />
        </Routes>
      </div>
    );
  }
  
  export default Review;
    