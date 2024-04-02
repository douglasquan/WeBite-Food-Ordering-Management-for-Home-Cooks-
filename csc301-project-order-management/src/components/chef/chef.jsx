import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import "./chef.css";
import Navbar from "../navbar/Navbar.jsx";
import OffcanvasBody from "react-bootstrap/esm/OffcanvasBody.js";
import { getReq, postReq, putReq, postReqForm, getImage } from "../view_control.js"; // Adjust the path as necessary

const Chef = () => {
  // chef container stuff
  const [meals, setMeals] = useState([]);
  const [mealFormData, setMealFormData] = useState({ name: "", cost: "" });
  const [chefId, setChefId] = useState(null);

  //image upload stuff
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);

  // hide and unhide edit form
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const init = async () => {
      await checkIfChef();
    };

    init();
  }, []); // Removed chefId dependency to prevent initial double call

  const checkIfChef = async () => {
    try {
      const response = await getReq("user/chef/is-chef");
      if (response.data.is_chef) {
        console.log("Chef ID:", response.data.chef_id);
        setChefId(response.data.chef_id);
        // Call fetchMeals here after the state is set
        fetchMeals(response.data.chef_id); // Pass chefId directly to ensure it's used immediately
      } else {
        console.log("User is not a chef.");
      }
    } catch (error) {
      console.error("Failed to check chef status:", error);
    }
  };

  const fetchMeals = async (chefIdParam) => {
    const currentChefId = chefIdParam || chefId;
    if (currentChefId === null) return; // Guard clause

    try {
      const response = await getReq(`meal/chef/${currentChefId}`);
      const meals = response.data;

      // Fetch all images concurrently and add image URLs to meals
      const mealsWithImages = await Promise.all(
        meals.map(async (meal) => {
          const imageUrl = await getImage(meal.meal_id); // Use the new fetchImage function
          console.log(imageUrl);
          return { ...meal, imageUrl }; // Add the imageUrl to the meal object
        })
      );

      setMeals(mealsWithImages);
    } catch (error) {
      console.error("Failed to fetch meals:", error);
    }
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      // Submit the meal data
      const mealResponse = await postReq("meal", { ...mealFormData, chef_id: chefId });
      const mealData = mealResponse.data;

      // Check if the meal was successfully created and the ID is returned
      if (mealData && mealData.meal_id && file) {
        // Now you have the meal_id, you can upload the image with this ID
        const formData = new FormData();

        formData.append("image", file);
        formData.append("meal_id", mealData.meal_id);

        // Upload the image with the meal_id
        await postReqForm("image", formData, true);
      }
      // If everything is successful, close the off-canvas and refresh the page
      handleClose();

      // This will cause a full page reload
      window.location.reload();
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  const handleDelete = (event) => {
    event.preventDefault();
  };

  const handleUpdate = (event) => {
    event.preventDefault();
  };

  // const reset = () => {
  //   setName();
  //   setPrice();
  // };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleOfferConfirmation = (mealId) => {
    const isConfirmed = window.confirm("Are you sure you want to set this meal as today’s offer?");
    if (isConfirmed) {
      updateMealOffer(mealId);
    }
  };

  const updateMealOffer = async (mealId) => {
    try {
      const response = await putReq(`meal/${mealId}`, { offer: true });
      if (response.status === 200) {
        // Assuming fetchMeals also updates the local state to reflect the current offers
        fetchMeals(chefId);
      }
    } catch (error) {
      console.error("Failed to update meal offer status:", error);
    }
  };

  const handleRemoveOfferConfirmation = (mealId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to remove this meal from today’s offer?"
    );
    if (isConfirmed) {
      removeMealOffer(mealId);
    }
  };

  const removeMealOffer = async (mealId) => {
    try {
      const response = await putReq(`meal/${mealId}`, { offer: false });
      if (response.status === 200) {
        // Refresh the meals to reflect the change
        fetchMeals(chefId);
      }
    } catch (error) {
      console.error("Failed to remove meal offer status:", error);
    }
  };

  return (
    <div className='bg-white'>
      <Navbar />
      <div className='max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h2 className='text-4xl font-extrabold tracking-tight text-gray-900'>Your Store</h2>
        <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {meals.map((meal) => (
            <div
              key={meal.meal_id}
              className={`group relative ${meal.offer ? "border-4 border-green-500" : ""}`}
            >
              <button
                onClick={() => handleOfferConfirmation(meal.meal_id)}
                className='text-xs text-white bg-green-500 hover:bg-green-400 px-2 py-1 rounded'
              >
                Set as Today's Offer
              </button>
              {meal.offer && (
                <button
                  onClick={() => handleRemoveOfferConfirmation(meal.meal_id)}
                  className='text-xs text-white bg-red-500 hover:bg-red-400 px-2 py-1 rounded'
                >
                  Remove Offer
                </button>
              )}
              <div className='w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none'>
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className='w-full h-full object-center object-cover lg:w-full lg:h-full'
                />
              </div>
              <div className='mt-4 flex justify-between'>
                <div>
                  <h3 className='text-sm text-gray-700'>{meal.name}</h3>
                </div>
                <p className='text-sm font-medium text-gray-900'>${meal.cost}</p>
              </div>
              {/* Edit button */}
              {/* <button className="absolute top-0 right-0 mt-2 mr-2 text-xs text-white bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded">
                Edit
              </button> */}
            </div>
          ))}
          {/* Add Product button */}
          <div className='flex items-center justify-center w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none'>
            {/* <button className="text-gray-700 bg-transparent hover:bg-gray-300 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4v16m8-8H4"/>
              </svg>
            </button> */}
            <Button variant='primary' onClick={handleShow}>
              Edit your menu !!!
            </Button>

            <Offcanvas
              show={show}
              onHide={handleClose}
              placement='bottom'
              backdrop='static'
              scroll={true}
              className='h-auto'
            >
              <Offcanvas.Header className='offHeader' closeButton>
                MENU EDITS!!!
              </Offcanvas.Header>

              <Offcanvas.Body className='overflow-visible'>
                <Tabs defaultActiveKey='profile' id='fill-tab-example' className='mb-3' fill>
                  <Tab eventKey='Add' title='Add' className='offbody'>
                    <form method='post' onSubmit={handleAdd} className='flex flex-col space-y-5'>
                      {/* Meal inputs */}
                      <div className='offInputs'>
                        <label>
                          Dish Name:{" "}
                          <input
                            className='meal-name-input mb-3 px-3 py-2 border rounded-lg w-full'
                            type='text'
                            name='name'
                            required
                            value={mealFormData.name}
                            onChange={(e) =>
                              setMealFormData({ ...mealFormData, name: e.target.value })
                            }
                          />
                        </label>
                        <hr />
                        <label>
                          Dish Price:{" "}
                          <input
                            className='meal-cost-input mb-3 px-3 py-2 border rounded-lg w-full'
                            type='number'
                            name='cost'
                            required
                            value={mealFormData.cost}
                            onChange={(e) =>
                              setMealFormData({ ...mealFormData, cost: e.target.value })
                            }
                          />
                        </label>
                      </div>
                      {/* Image upload */}
                      <div className='image-upload-container mx-auto mt-10'>
                        <div className='max-w-md mx-auto bg-white p-5 border rounded-md'>
                          {/* Preview image if available */}
                          {preview && (
                            <img src={preview} alt='Preview' className='w-full h-auto bg-cover' />
                          )}
                          {/* Image file input */}
                          <input
                            type='file'
                            name='image'
                            onChange={handleImageChange}
                            className='file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100'
                          />
                        </div>
                      </div>
                      {/* Form submission buttons */}
                      <div className='form-actions'>
                        {/* <button type='reset' onClick={reset}>
                          Reset form
                        </button> */}
                        <button
                          type='submit'
                          className='mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg'
                        >
                          Add Meal and Upload Image
                        </button>
                      </div>
                    </form>
                  </Tab>
                  <Tab eventKey='Delete' title='Delete' className='offbody'>
                    <form method='post'>
                      <div className='offInputs'>
                        <label>
                          Dish Name: <input className='labelContainer' name='myInput' required />
                        </label>
                        <hr />
                        <label>
                          Dish Price: <input className='labelContainer' name='myInput' required />
                        </label>
                      </div>

                      {/* <div className='offButtons'>
                        <button type='reset' onClick={reset}>
                          Reset form
                        </button>
                        <button type='submit'>Submit form</button>
                      </div> */}
                    </form>
                  </Tab>
                  <Tab eventKey='Update' title='Update' className='offbody'>
                    <form method='post'>
                      <div className='offInputs'>
                        <label>
                          Dish Name: <input className='labelContainer' name='myInput' required />
                        </label>
                        <hr />
                        <label>
                          Dish Price: <input className='labelContainer' name='myInput' required />
                        </label>
                      </div>

                      {/* <div className='offButtons'>
                        <button type='reset' onClick={reset}>
                          Reset form
                        </button>
                        <button type='submit'>Submit form</button>
                      </div> */}
                    </form>
                  </Tab>
                </Tabs>
              </Offcanvas.Body>
            </Offcanvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chef;
