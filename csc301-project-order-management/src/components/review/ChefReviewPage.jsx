import React, { useEffect, useState } from 'react';
import Navbar from "../navbar/Navbar.jsx";
import { getReq } from '../view_control'; // Adjust the import path based on your project structure

const ChefReviewPage = () => {
    // const [reviews, setReviews] = useState([]);

    // useEffect(() => {
    //     const fetchReviews = async () => {
    //         try {
    //             const response = await getReq('chef/reviews'); // Adjust the endpoint as necessary
    //             setReviews(response.data.reviews); // Adjust according to your response structure
    //         } catch (error) {
    //             console.error('Error fetching reviews:', error);
    //         }
    //     };

    //     fetchReviews();
    // }, []);

    const [reviews, setReviews] = useState([
      {
          id: 1,
          meal_id: 101,
          title: "Delicious and fresh",
          content: "The meals were absolutely wonderful, from preparation to presentation, very pleasing. We especially enjoyed the special barbeque sauce, it was amazing!"
      },
      {
          id: 2,
          meal_id: 102,
          title: "Incredible service",
          content: "Not only was the food amazing, but the service we received was beyond fantastic. Our chef was attentive, professional, and kind. Can't wait to order again!"
      },
      {
          id: 3,
          meal_id: 103,
          title: "Exceeded expectations",
          content: "Every dish was more delicious than the last. I didn't expect to enjoy a home dining experience this much. The chef really knows how to bring out the flavor!"
      },
      {
          id: 4,
          meal_id: 104,
          title: "Perfect for our event",
          content: "We hired the chef for a small family gathering and were thrilled with the quality of the food and service. The chef was flexible with our dietary restrictions and everyone was happy."
      },
      {
          id: 5,
          meal_id: 105,
          title: "A night to remember",
          content: "The entire evening was a delight thanks to the chef's culinary skills and charming presence. Every course was a surprise and a delight. Highly recommend!"
      }
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <div className="w-full flex justify-center">
            <div className="w-full max-w-lg px-4 py-8 bg-gray-50 shadow-md rounded-lg">
                <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Reviews</h2>
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-medium text-gray-700">{review.title}</h3>
                            <div className="text-sm text-gray-500 mb-2">Meal ID: {review.meal_id}</div>
                            <p className="text-gray-600 mt-2">{review.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
};

export default ChefReviewPage;

