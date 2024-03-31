import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar.jsx"; // Adjust the import path as necessary
import { getReq, postReq, putReq } from "../view_control.js"; // Adjust the path as necessary

const Chef = () => {
  const [meals, setMeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [mealFormData, setMealFormData] = useState({ name: '', cost: '' });
  const [currentMealId, setCurrentMealId] = useState(null);
  const [chefId, setChefId] = useState(null);

  useEffect(() => {
    checkIfChef();
    fetchMeals();
  }, [chefId]);

  const fetchMeals = async () => {
    try {
      const response = await getReq(`meal/chef/${chefId}`);
      setMeals(response.data);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
    }
  };

  const checkIfChef = async () => {
    try {
        const response = await getReq('user/chef/is-chef');
        if (response.data.is_chef) {
            console.log("Chef ID:", response.data.chef_id);
            setChefId(response.data.chef_id);
        } else {
            console.log("User is not a chef.");
        }
    } catch (error) {
        console.error('Failed to check chef status:', error);
    }
};

  const handleModalShow = (meal = null) => {
    setShowModal(true);
    if (meal) {
      setEditMode(true);
      setCurrentMealId(meal.meal_id);
      setMealFormData({ name: meal.name, cost: meal.cost.toString() });
    } else {
      setEditMode(false);
      setMealFormData({ name: '', cost: '' });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setMealFormData({ name: '', cost: '' });
    setEditMode(false);
    setCurrentMealId(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setMealFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const saveMeal = async () => {
    try {
      if (editMode) {
        await putReq(`meal/${currentMealId}`, mealFormData);
      } else {
        await postReq('meal', { ...mealFormData, chef_id: chefId });
      }
      fetchMeals();
      handleModalClose();
    } catch (error) {
      console.error('Failed to save the meal:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <div key={meal.meal_id} className="border p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">{meal.name}</h3>
              <p className="text-lg">${meal.cost}</p>
              <button
                className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleModalShow(meal)}
              >
                Edit
              </button>
            </div>
          ))}
          <button
            className="mt-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleModalShow()}
          >
            Add New Meal
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-xl font-bold">{editMode ? 'Edit Meal' : 'Add New Meal'}</h3>
                <div className="mt-2 px-7 py-3">
                  <input
                    type="text"
                    name="name"
                    value={mealFormData.name}
                    onChange={handleFormChange}
                    className="mb-3 px-3 py-2 border rounded-lg w-full"
                    placeholder="Meal Name"
                  />
                  <input
                    type="number"
                    name="cost"
                    value={mealFormData.cost}
                    onChange={handleFormChange}
                    className="mb-3 px-3 py-2 border rounded-lg w-full"
                    placeholder="Meal Cost"
                  />
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={saveMeal}
                  >
                    {editMode ? 'Update Meal' : 'Add Meal'}
                  </button>
                  <button
                    className="mt-3 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={handleModalClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chef;
