import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import Navbar from "../navbar/Navbar.jsx";

function ChefReviewPage() {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://backend-address/review'); // Replace with backend address
      setReviews(response.data); // Assuming the response data is the list of reviews
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []); 

  return (
    <div className="reviews-container">
      <Navbar />
      {reviews.map(review => (
        <div key={review.review_id} className="review">
          <h3>{`Review for meal ID: ${review.meal_id}`}</h3>
          <p>{review.review_description}</p>
          <p>{`Rating: ${review.new_rating}`}</p>
        </div>
      ))}
    </div>
  );
}

export default ChefReviewPage;
