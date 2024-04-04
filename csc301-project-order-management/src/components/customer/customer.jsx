import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar.jsx";
import "./customer.css";
import { getReq, getImage, postReq } from "../view_control.js";

const Customer = () => {
  const [chefs, setChefs] = useState([]);
  const [selectedChefId, setSelectedChefId] = useState(null);
  const [meals, setMeals] = useState([]);
  const [cart, setCart] = useState({});
  const [customerID, setCustomerID] = useState(null);

  useEffect(() => {
    // If no chef is selected, fetch all chefs
    if (!selectedChefId) {
      setMeals([]);
      const fetchChefs = async () => {
        try {
          const response = await getReq("/user/chef/all");
          const fetchedChefs = response.data.chefs;
          // Fetch usernames for each chef
          const chefsWithUsernames = await Promise.all(
            fetchedChefs.map(async (chef) => {
              try {
                const userResponse = await getReq(`/user/${chef.user_id}`);
                return { ...chef, username: userResponse.data.username };
              } catch (error) {
                console.error(`Error fetching user data for user_id ${chef.user_id}:`, error);
                return { ...chef, username: "Unknown" }; // Fallback username
              }
            })
          );
          setChefs(chefsWithUsernames);
        } catch (error) {
          console.error("Error fetching chefs:", error);
        }
      };
      fetchChefs();
    }
    // Fetch customer ID
    const fetchCustomerID = async () => {
      try {
        const response = await getReq("/user/customer/get-id");
        setCustomerID(response.data.customer_id); // Assuming the response has a customer_id field
      } catch (error) {
        console.error("Error fetching customer ID:", error);
      }
    };

    fetchCustomerID();
  }, [selectedChefId]); // Depend on selectedChefId

  const fetchMeals = async (chefId) => {
    try {
      const response = await getReq(`meal/chef/${chefId}`);
      const meals = response.data;
      if (meals.length === 0) {
        // If the chef has no meals, clear the meals state
        setMeals([]);
      } else {
        // Fetch all images concurrently and add image URLs to meals
        const mealsWithImages = await Promise.all(
          meals.map(async (meal) => {
            const imageUrl = await getImage(meal.meal_id); // Use the new fetchImage function
            console.log(imageUrl);
            return { ...meal, imageUrl }; // Add the imageUrl to the meal object
          })
        );
        setMeals(mealsWithImages);
      }
    } catch (error) {
      console.error("Failed to fetch meals:", error);
      setMeals([]);
    }
  };

  // When a chef is selected, fetch their meals
  useEffect(() => {
    if (selectedChefId) {
      fetchMeals(selectedChefId);
    }
  }, [selectedChefId]);

  // ---------------------Add/Update Cart---------------------
  const addToCart = async (mealId) => {
    if (cart[mealId]) {
      // If meal already in cart, increase quantity
      setCart({
        ...cart,
        [mealId]: {
          ...cart[mealId],
          quantity: cart[mealId].quantity + 1,
        },
      });
    } else {
      // Fetch meal details and add to cart
      try {
        const response = await getReq(`meal/${mealId}`);
        const { name, cost } = response.data;
        setCart({
          ...cart,
          [mealId]: {
            name,
            price: cost,
            quantity: 1,
          },
        });
      } catch (error) {
        console.error("Failed to fetch meal details:", error);
      }
    }
  };

  const updateQuantity = (mealId, delta) => {
    if (cart[mealId]) {
      const newQuantity = cart[mealId].quantity + delta;
      if (newQuantity > 0) {
        setCart({
          ...cart,
          [mealId]: {
            ...cart[mealId],
            quantity: newQuantity,
          },
        });
      } else {
        // If quantity is 0, remove the item
        const newCart = { ...cart };
        delete newCart[mealId];
        setCart(newCart);
      }
    }
  };

  const deleteItem = (mealId) => {
    const newCart = { ...cart };
    delete newCart[mealId];
    setCart(newCart);
  };

  const calculateTotalPrice = () => {
    return Object.values(cart)
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // ---------------------Place Order---------------------
  const placeOrder = async () => {
    if (!customerID) {
      console.error("Customer ID is not set. Cannot place order.");
      return;
    }

    try {
      const orderPromises = Object.keys(cart).map(async (mealId) => {
        const meal = cart[mealId];
        const orderData = {
          chef_id: selectedChefId, // Assuming chef_id is stored when a chef is selected
          customer_id: customerID,
          meal_id: mealId,
          quantity: meal.quantity,
          price: meal.price * meal.quantity, // Total price for this meal
        };

        await postReq("order", orderData); // Assuming postReq is similar to getReq but for POST requests
      });

      await Promise.all(orderPromises);
      console.log("All orders placed successfully!");
      // Clear cart after placing orders or handle as needed
      setCart({});
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  return (
    <div className='bg-white'>
      <Navbar />
      <div className='max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
        {!selectedChefId ? (
          <>
            <h1 className='text-2xl font-bold mb-5'>Our Chefs</h1>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {chefs.map((chef) => (
                <div
                  key={chef.chef_id}
                  className='max-w-sm rounded overflow-hidden shadow-lg p-4 cursor-pointer transition-colors duration-300 hover:bg-gray-100'
                  onClick={() => setSelectedChefId(chef.chef_id)}
                >
                  <div className='px-6 py-4'>
                    <div className='font-bold text-xl mb-2'>{chef.username || "Chef"}</div>
                    <p className='text-gray-700 text-base'>{chef.description}</p>
                  </div>
                  <div className='px-6 pt-4 pb-2'>
                    <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
                      {`Rating: ${chef.rating}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Order page
          <>
            <h1 className='text-2xl font-bold mb-5'>Meals</h1>
            <button
              onClick={() => setSelectedChefId(null)}
              className='mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              Back to Chefs
            </button>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {meals.map((meal) => (
                <div
                  key={meal.meal_id}
                  className={`group relative rounded overflow-hidden shadow-lg p-4 ${
                    meal.offer ? "border-4 border-green-500" : ""
                  }`}
                >
                  {meal.offer && <p className='text-gray-700 text-base'> Today's Offer</p>}
                  <img src={meal.imageUrl} alt='Meal' className='w-full h-32 object-cover' />
                  <div className='px-6 py-4'>
                    <div className='font-bold text-xl mb-2'>{meal.name}</div>
                    <p className='text-gray-700 text-base'>{meal.cost}</p>
                    {meal.offer && (
                      <button
                        className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={() => addToCart(meal.meal_id)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Shopping Cart */}
        <div className='mt-8'>
          <h2 className='text-2xl font-bold mb-4'>Shopping Cart</h2>
          <table className='w-full text-left'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th colSpan='3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(cart).map((mealId) => (
                <tr key={mealId}>
                  <td>{cart[mealId].name}</td>
                  <td>${cart[mealId].price.toFixed(2)}</td>
                  <td>{cart[mealId].quantity}</td>
                  <td>${(cart[mealId].price * cart[mealId].quantity).toFixed(2)}</td>
                  <td>
                    <button className='btn decrease' onClick={() => updateQuantity(mealId, -1)}>
                      -
                    </button>
                  </td>
                  <td>
                    <button className='btn increase' onClick={() => updateQuantity(mealId, 1)}>
                      +
                    </button>
                  </td>
                  <td>
                    <button className='btn delete' onClick={() => deleteItem(mealId)}>
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='mt-4'>
            <strong>Total Price: </strong>${calculateTotalPrice()}
          </div>
        </div>
        <div>
          {/* Existing JSX */}
          <button
            onClick={placeOrder}
            className='mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
          >
            Place Order
          </button>
        </div>
      </div>
      <footer className='bg-gray-800 fixed bottom-0 w-full'>
        <p className='text-center text-sm text-gray-300 py-4'>
          Copyright © 2024 by WeBite.Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
export default Customer;
