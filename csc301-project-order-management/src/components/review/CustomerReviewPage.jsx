import React, { useState, useEffect, useContext } from "react";
import { getReq, postReq } from "../view_control";
import Navbar from "../navbar/Navbar.jsx"; // Adjust the path if necessary

// Assuming AuthContext is the context providing auth information
// import { AuthContext } from '../path-to-auth-context';

const CustomerReviewPage = () => {
  const [customerOrders, setCustomerOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [review, setReview] = useState("");
  const [mealNames, setMealNames] = useState({});
  const [customerID, setCustomerID] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  // Fetch customer_id on component mount
  useEffect(() => {
    setErrorMessage("");
    // Replace 'your-method-here' with the actual method to fetch the customer ID
    const fetchCustomerId = async () => {
      try {
        const response = await getReq("user/customer/get-id");
        if (response.data.customer_id) {
          setCustomerID(response.data.customer_id);
        } else {
          console.log("User is not recognized as a customer.");
        }
      } catch (error) {
        console.error("Failed to check customer status:", error);
      }
    };

    fetchCustomerId();
  }, []);

  // Fetch customer's past orders once the customer_id is set
  useEffect(() => {
    const fetchCustomerOrders = async () => {
      if (customerID) {
        try {
          const response = await getReq(`order/customer/${customerID}`);
          setCustomerOrders(response.data || []);
          const uniqueMealIds = [...new Set(response.data.map((order) => order.meal_id))];
          for (const mealId of uniqueMealIds) {
            if (!mealNames[mealId]) {
              try {
                const mealResponse = await getReq(`/meal/${mealId}`);
                setMealNames((prev) => ({ ...prev, [mealId]: mealResponse.data.name }));
              } catch (error) {
                console.error(`Failed to fetch name for meal ID ${mealId}:`, error);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching customer orders:", error);
        }
      }
    };

    fetchCustomerOrders();
  }, [customerID]);

  const handleSelectChange = (event) => {
    setErrorMessage("");
    const orderID = parseInt(event.target.value);
    const order = customerOrders.find((o) => o.order_id === orderID);
    setSelectedOrder(order || null); // Set the entire order object or null if not found
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedOrder) return; // Add a check to make sure an order is selected

    try {
      console.log(selectedOrder.meal_id); // Now we have the correct meal_id
      console.log(customerID);
      await postReq("review", {
        meal_id: selectedOrder.meal_id, // Use the meal_id from the selected order
        customer_id: customerID,
        review_description: review,
        rating: rating,
      });
      setSuccessMessage("Review submitted successfully!");
      setSelectedOrder("");
      setReview("");
      setRating(null); // Reset the rating
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Duplicate entry error
        setErrorMessage("You have already submitted a review for this order.");
      } else {
        // Other errors
        setErrorMessage("Failed to submit review. Please try again later.");
      }
    }
  };

  return (
    <div className='bg-custom-grey min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex justify-center items-center mt-10'>
        <div className='w-full max-w-xl bg-white rounded-lg shadow-md p-6'>
          {successMessage && (
            <div
              className='bg-green-100 border-l-4 border-green-500 text-green-700 p-4'
              role='alert'
            >
              <p>{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4' role='alert'>
              <p>{errorMessage}</p>
            </div>
          )}
          {customerOrders.length > 0 ? (
            <form onSubmit={handleSubmit}>
              {/* Order selection dropdown */}
              <label htmlFor='orderSelect' className='block text-gray-700 text-sm font-bold mb-2'>
                Select Order:
              </label>
              <select
                id='orderSelect'
                className='mb-4 shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                value={selectedOrder ? selectedOrder.order_id : ""}
                onChange={handleSelectChange}
                required
              >
                <option value=''>Select an order</option>
                {customerOrders.map((order) => (
                  <option key={order.order_id} value={order.order_id}>
                    Order #{order.order_id} - {mealNames[order.meal_id]}
                  </option>
                ))}
              </select>
              {/* Review text area */}
              <label htmlFor='reviewText' className='block text-gray-700 text-sm font-bold mb-2'>
                Your Review:
              </label>
              <textarea
                id='reviewText'
                className='mb-6 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                rows='3'
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
              />
              <div className='flex items-center mb-4'>
                <label className='block text-gray-700 text-sm font-bold mr-2'>Rating:</label>
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <label key={index}>
                      <input
                        type='radio'
                        name='rating'
                        className='hidden'
                        value={ratingValue}
                        onClick={() => setRating(ratingValue)}
                      />
                      <span
                        className={`text-2xl cursor-pointer ${
                          ratingValue <= (hover || rating) ? "text-yellow-500" : "text-gray-300"
                        }`}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                      >
                        ★
                      </span>
                    </label>
                  );
                })}
              </div>
              {/* Submit button */}
              <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              >
                Submit Review
              </button>
            </form>
          ) : (
            <div className='text-center my-5'>
              <p>You have not placed any orders yet.</p>
            </div>
          )}
        </div>
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

export default CustomerReviewPage;
