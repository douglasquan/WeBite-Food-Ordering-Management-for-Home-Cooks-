import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from "../csc301-project-order-management/src/components/navbar/Navbar.jsx";
import ChefSummaryPage from './chef_summary.jsx';
import CustomerSummaryPage from './customer_summary.jsx';

function Summary() {
    return (
      <div>
        <Navbar />
        <Routes>
          <Route path="chef-summary" element={<ChefSummaryPage />} />
          <Route path="customer-summary" element={<CustomerSummaryPage />} />
        </Routes>
      </div>
    );
  }
  
  export default Summary;
    