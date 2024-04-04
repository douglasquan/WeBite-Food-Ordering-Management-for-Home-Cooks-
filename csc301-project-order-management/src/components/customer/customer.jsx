import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar.jsx";
import { getReq, getImage, postReq } from "../view_control.js";

const Customer = () => {
  const [chefs, setChefs] = useState([]);
  const [selectedChefId, setSelectedChefId] = useState(null);
  const [meals, setMeals] = useState([]);
  const [cart, setCart] = useState({});
  const [customerID, setCustomerID] = useState(null);
  const [cartVisible, setCartVisible] = useState(false); // New state for cart visibility

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
    setCartVisible(true);
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
    setCartVisible(Object.keys(cart).length > 0);
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
    <div class="flex flex-col items-center h-screen">
      <Navbar />
      <main className="flex justify-center items-start">
        <div className={`px-4 ${cartVisible ? 'md:mr-80' : ''}`}>
          <div className='max-w-5xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
          {!selectedChefId ? (
            <>
              <h1 className='text-2xl font-bold mb-5 text-center'>Our Chefs</h1>
              <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                {chefs.map((chef) => (
                  <div
                    key={chef.chef_id}
                    className='max-w-sm rounded overflow-hidden shadow-lg p-4 cursor-pointer transition-colors duration-300 hover:bg-gray-100'
                    onClick={() => setSelectedChefId(chef.chef_id)}
                  >
                    <div className='px-6 py-4'>
                      <div className='font-bold text-xl mb-2 text-center'>{chef.username || "Chef"}</div>
                      <p className='text-gray-700 text-base text-center'>{chef.description}</p>
                    </div>
                    <div className='flex flex-col items-center px-6 pt-4 pb-2'>
                      <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
                        {`Rating: ${chef.rating}`}
                      </span>
                      <button className="w-full bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm mt-4">View Menu</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
            ) : (
              <div className="container mx-auto pt-4">
                <h2 className="text-xl font-bold text-center mt-2 mb-8">Menu</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {meals.map((meal) => (
                    <div key={meal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img src={meal.imageUrl} alt={meal.name} className="w-full h-32 sm:h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{meal.name}</h3>
                        <p className="text-gray-700 text-sm">{meal.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-lg font-semibold">{`$${meal.cost}`}</span>
                          <button onClick={() => addToCart(meal.meal_id)} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">Add to Cart</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setSelectedChefId(null)} className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  Back to Chefs
                </button>
              </div>
            )}
          </div>

          {cartVisible && (
            <aside className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl p-4 overflow-y-auto z-10">
              <button onClick={() => setCartVisible(false)} className="text-black">
                Close
              </button>
              <h2 className="text-xl font-bold border-b pb-4">Shopping Cart</h2>
              <ul>
                {Object.keys(cart).map(mealId => (
                  <li key={mealId} className="flex items-center p-2 border-b">
                    <span>{cart[mealId].name}</span>
                    <div className="flex items-center ml-auto">
                      <button onClick={() => updateQuantity(mealId, -1)} className="text-black mx-2">
                        -
                      </button>
                      <span>{cart[mealId].quantity}</span>
                      <button onClick={() => updateQuantity(mealId, 1)} className="text-black mx-2">
                        +
                      </button>
                    </div>
                    <span>${(cart[mealId].price * cart[mealId].quantity).toFixed(2)}</span>
                    <button onClick={() => deleteItem(mealId)} className="text-red-500 ml-4">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4">
                <strong>Total:</strong> ${calculateTotalPrice()}
                <button
                  onClick={placeOrder}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4"
                >
                  Place Order
                </button>
              </div>
            </aside>
          )}  
        </div>
      </main>
      <footer className="bg-gray-800 text-white text-center py-4 w-full">
        Copyright © 2024 by WeBite.Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default Customer;