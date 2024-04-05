import React, { useState, useEffect } from "react";
import { getReq, getImage } from "../view_control";
import Navbar from "../navbar/Navbar.jsx";

const ChefReviewPage = () => {
  const [chefId, setChefId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [mealNames, setMealNames] = useState({});

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
          const mealsResponse = await getReq(`meal/chef/${chefId}`);
          const mealIds = mealsResponse.data.map((meal) => meal.meal_id);
          const allReviews = [];

          // Fetch meal names first
          const fetchedMealNames = {};
          for (const mealId of mealIds) {
            try {
              const mealResponse = await getReq(`/meal/${mealId}`);
              const imageUrl = await getImage(mealId);
              fetchedMealNames[mealId] = {
                name: mealResponse.data.name,
                imageUrl: imageUrl, // Assume this field holds the URL
              };
            } catch (error) {
              console.log(`Error fetching meal details for meal ID ${mealId}:`, error);
            }
          }
          setMealNames(fetchedMealNames);

          // Then fetch reviews for each meal
          for (const mealId of mealIds) {
            try {
              const response = await getReq(`review/meal/${mealId}`);
              // Append meal name to each review for easier rendering
              const reviewsWithMealName = response.data.map((review) => ({
                ...review,
                mealName: fetchedMealNames[mealId],
              }));
              allReviews.push(...reviewsWithMealName);
            } catch (error) {
              console.log(`No reviews found for meal ID ${mealId}. Skipping...`);
            }
          }

          allReviews.sort((a, b) => b.review_id - a.review_id);
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
    <div className='bg-custom-grey min-h-screen flex flex-col'>
      <Navbar />
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-8'>
        <h2 className='text-3xl font-semibold leading-tight text-center mb-6'>
          Reviews for My Meals
        </h2>
        {reviews.length > 0 ? (
          <div className='space-y-8'>
            {" "}
            {/* Increase space between reviews */}
            {reviews.map((review) => (
              <div
                key={review.review_id}
                className='bg-white shadow rounded-lg p-8 mb-6 flex gap-6' // Increase padding and gap
              >
                {/* Meal Image */}
                <img
                  src={mealNames[review.meal_id]?.imageUrl || "path/to/default/image"}
                  alt='Meal'
                  className='w-32 h-32 object-cover rounded-lg' // Increase image size and use rounded-lg for a subtle look
                />
                <div className='flex-grow flex flex-col justify-between'>
                  {/* Star Icons Display */}
                  <div className='flex text-yellow-500'>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className='text-xl'>
                        {" "}
                        {/* Increase star size */}
                        {i < review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <div>
                    <div className='text-xl font-semibold text-gray-900'>
                      {/* Increase font size */}
                      {mealNames[review.meal_id]?.name.replace(/_/g, " ")}
                    </div>
                    <p className='mt-4 text-lg text-gray-500'>{review.review_description}</p>
                    {/* Increase margin-top and text size */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500 text-center my-5'>No reviews found.</p>
        )}
      </div>

      <div className='flex-grow'></div>

      {/* Footer */}
      <footer className='bg-gray-800 w-full py-4'>
        <p className='text-center text-sm text-gray-300'>
          Copyright © 2024 by WeBite.Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ChefReviewPage;
