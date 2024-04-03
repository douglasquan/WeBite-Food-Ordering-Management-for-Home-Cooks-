import React, { useState, useEffect } from "react";
import { getReq } from "../view_control";
import Navbar from "../navbar/Navbar.jsx"; // Adjust path as necessary

const ChefReviewPage = () => {
  const [chefId, setChefId] = useState(null); // Replace with chef ID logic
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getChefId = async () => {
      try {
        const response = await getReq("user/chef/is-chef");
        if (response.data.chef_id) {
          setChefId(response.data.chef_id);
        } else {
          console.log("User is not recognized as a chef.");
        }
      } catch (error) {
        console.error("Failed to check chef status:", error);
      }
    };

    getChefId();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (chefId) {
        try {
          // First, fetch the meals by chef
          const mealsResponse = await getReq(`meal/chef/${chefId}`);
          const mealIds = mealsResponse.data.map((meal) => meal.meal_id);

          // Initialize an array to hold all reviews
          const allReviews = [];

          // Fetch reviews for each meal
          for (const mealId of mealIds) {
            try {
              const response = await getReq(`review/meal/${mealId}`);
              allReviews.push(...response.data); // Spread operator to flatten the array
            } catch (error) {
              // Handle specific error (e.g., 404 Not Found) gracefully
              if (error.response && error.response.status === 404) {
                console.log(`No reviews found for meal ID ${mealId}. Skipping...`);
                continue; // Skip this iteration and continue with the next mealId
              } else {
                // Log other errors
                console.error(`Error fetching reviews for meal ID ${mealId}:`, error);
              }
            }
          }

          // Sort and update state with aggregated reviews
          allReviews.sort((a, b) => b.review_id - a.review_id); // Example sorting
          console.log("Fetched reviews data:", allReviews);
          setReviews(allReviews);
        } catch (error) {
          console.error("Error fetching meals or reviews:", error);
        }
      }
    };

    fetchReviews();
  }, [chefId]);

  console.log("Reviews:", reviews);
  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-2xl font-semibold leading-tight'>Reviews for My Meals</h2>
        <div className='mt-6 overflow-hidden shadow rounded-lg divide-y divide-gray-200'>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.review_id} className='px-6 py-4 whitespace-nowrap'>
                <div className='flex items-center'>
                  <div className='text-sm font-medium text-gray-900'>Meal ID: {review.meal_id}</div>
                  <div className='ml-2 text-sm text-gray-500'>Rating: {review.rating}</div>
                  <div className='ml-4 text-sm text-gray-600'>{review.review_description}</div>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500 px-6 py-4'>No reviews found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefReviewPage;
