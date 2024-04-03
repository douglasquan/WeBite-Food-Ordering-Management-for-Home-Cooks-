import React, { useState, useEffect } from 'react';
import { getReq } from '../view_control';
import Navbar from "../navbar/Navbar.jsx"; // Adjust path as necessary

const ChefReviewPage = () => {
  const [chefId, setChefId] = useState(null); // Replace with chef ID logic
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getChefId = async () => {
        try {
            const response = await getReq("user/chef/get-id");
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
          const mealIds = mealsResponse.data.map(meal => meal.meal_id);

          // Then fetch reviews for each meal
          const reviewsPromises = mealIds.map(mealId =>
            getReq(`review/meal/${mealId}`)
          );
          const reviewsResponses = await Promise.all(reviewsPromises);

          // Aggregate reviews from all meals
          const allReviews = reviewsResponses
            .flatMap(response => response.data)
            .sort((a, b) => b.review_id - a.review_id); // Sort by review_id for example
            console.log('Fetched reviews data:', allReviews); 
          setReviews(allReviews);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      }
    };

    fetchReviews();
  }, [chefId]);

  console.log('Reviews:', reviews);
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold leading-tight">Reviews for My Meals</h2>
        <div className="mt-6 overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.review_id} className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">Meal ID: {review.meal_id}</div>
                  <div className="ml-2 text-sm text-gray-500">Rating: {review.rating}</div>
                  <div className="ml-4 text-sm text-gray-600">{review.review_description}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 px-6 py-4">No reviews found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefReviewPage;


