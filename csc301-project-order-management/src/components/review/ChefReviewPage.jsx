import React, { useEffect, useState } from 'react';
import Navbar from "../navbar/Navbar.jsx";
import { getReq } from '../view_control'; // Adjust the import path based on your project structure

const ChefReviewPage = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await getReq('chef/reviews'); // Adjust the endpoint as necessary
                setReviews(response.data.reviews); // Adjust according to your response structure
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

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

