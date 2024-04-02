import React, { useState } from 'react';
import Navbar from "../navbar/Navbar.jsx";
import { postReq } from '../view_control.js';

function CustomerReviewPage() {
  const [mealId, setMealId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [reviewDescription, setReviewDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    postReq('review', {
      meal_id: mealId,
      customer_id: customerId,
      review_description: reviewDescription,
      rating: rating,
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something went wrong');
      })
      .then(data => {
        setMessage('Review submitted successfully');
        setSubmitting(false);
        // Clear form fields
        setMealId('');
        setCustomerId('');
        setReviewDescription('');
        setRating(0);
      })
      .catch(error => {
        console.error('Error submitting review:', error);
        setMessage('Failed to submit review');
        setSubmitting(false);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
    <Navbar />
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md px-6 py-8 md:px-8 bg-white shadow-md overflow-hidden md:max-w-lg lg:w-1/3">
        <h1 className="text-lg font-bold text-center mb-4">Submit Your Review</h1>
        {message && (
          <div className={`mb-4 p-4 text-sm rounded-lg text-center ${message.startsWith('Failed') ? 'text-red-500 bg-red-100' : 'text-green-500 bg-green-100'}`} role="alert">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Meal ID:</label>
            <input type="text" value={mealId} onChange={(e) => setMealId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer ID:</label>
            <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Review:</label>
            <textarea value={reviewDescription} onChange={(e) => setReviewDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating:</label>
            <input type="number" value={rating} min="1" max="5" onChange={(e) => setRating(parseInt(e.target.value, 10))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <button type="submit" disabled={submitting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  </div>

  );
}

export default CustomerReviewPage;
