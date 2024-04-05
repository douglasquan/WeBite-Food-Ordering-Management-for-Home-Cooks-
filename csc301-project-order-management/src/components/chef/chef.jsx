import React, { useState, useEffect } from "react";
// import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Modal from "react-bootstrap/Modal";

// import "./chef.css";
import Navbar from "../navbar/Navbar.jsx";
import { getReq, postReq, putReq, postReqForm, getImage, deleteReq } from "../view_control.js";

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

  // hide and unhide offer button
  const [currentOfferId, setCurrentOfferId] = useState(null);

  // Notification Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Confirmation Model
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [mealIdToConfirm, setMealIdToConfirm] = useState(null);

  const [showOfferConfirmationModal, setShowOfferConfirmationModal] = useState(false);
  const [mealIdForOffer, setMealIdForOffer] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [fontSize, setFontSize] = useState("base"); // 'base', 'lg', 'xl', etc.

  useEffect(() => {
    const init = async () => {
      await checkIfChef();
    };

    init();
  }, []); // Removed chefId dependency to prevent initial double call

  const handleShowModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

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
      handleShowModal("Failed to check chef status. Please try again later.");
    }
  };

  const fetchMeals = async (chefIdParam) => {
    const currentChefId = chefIdParam || chefId;
    if (currentChefId === null) return; // Guard clause

    try {
      const response = await getReq(`meal/chef/${currentChefId}`);
      const meals = response.data;

      if (meals.length === 0) {
        // Handle the case where no meals are found
        setMeals([]);
        // Optionally, you can set a state to show a "no meals available" message
        // For example: setNoMealsMessage('No meals are currently available.');
        return;
      }

      const mealsWithImages = await Promise.all(
        meals.map(async (meal) => {
          const imageUrl = await getImage(meal.meal_id);
          return { ...meal, imageUrl };
        })
      );

      setMeals(mealsWithImages);
    } catch (error) {
      console.error("Failed to fetch meals:", error);
      handleShowModal("Failed to fetch meals. Please try again later.");
    }
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      const mealResponse = await postReq("meal", { ...mealFormData, chef_id: chefId });
      const mealData = mealResponse.data;
      if (mealData && mealData.meal_id && file) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("meal_id", mealData.meal_id);
        await postReqForm("image", formData, true);
      }
      setSuccessMessage("Meal added successfully!"); // Update the success message
      setTimeout(() => setSuccessMessage(""), 5000); // Clear the message after 5 seconds
      // If everything is successful, close the off-canvas and refresh the page
      handleClose();
      setMealFormData({ name: "", cost: "" }); // Reset form fields
      setFile(null); // Clear the file state
      setPreview(""); // Clear the image preview
      fetchMeals(); // Refresh the meal list
    } catch (error) {
      console.error("Error adding meal:", error);
      handleShowModal("Error adding meal. Please check the meal details and try again.");
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!mealFormData.name) {
      handleShowModal("Please enter a dish name.");
      return;
    }

    try {
      // Step 1: Send a GET request to retrieve the meal ID using the meal name
      const getResponse = await getReq(`meal/name/${mealFormData.name}`);
      if (!getResponse.data || !getResponse.data.meal_id) {
        handleShowModal("Meal not found.");
        return;
      }

      const mealId = getResponse.data.meal_id;

      // Step 2: Send a DELETE request to delete the meal using the meal ID
      const deleteResponse = await deleteReq(`meal/${mealId}`);
      if (deleteResponse.status === 200) {
        setSuccessMessage("Meal deleted successfully.");
        setTimeout(() => setSuccessMessage(""), 5000);
        // Optionally, refresh the meals list to reflect the deletion
        fetchMeals(chefId);

        // Reset form data
        setMealFormData({ name: "", cost: "" });

        // Close the form if it's open
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
      handleShowModal("You cannot delete a meal that has been ordered.");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // handle "today's offer"
  const handleOfferConfirmation = (mealId) => {
    setMealIdForOffer(mealId); // Store the meal ID for later use
    setShowOfferConfirmationModal(true); // Show the confirmation modal
  };

  const confirmSetOffer = async () => {
    if (mealIdForOffer !== null) {
      await updateMealOffer(mealIdForOffer);
      setMealIdForOffer(null); // Reset the meal ID for offer
    }
    setShowOfferConfirmationModal(false); // Hide the confirmation modal
  };

  const removeMealOffer = async (mealId) => {
    try {
      const response = await putReq(`meal/${mealId}`, { offer: false });
      if (response.status === 200) {
        fetchMeals(chefId);
        setCurrentOfferId(null); // Clear the current offer ID
      }
    } catch (error) {
      console.error("Failed to update meal offer status:", error);
      handleShowModal("An error occurred while updating the offer. Please try again.");
    }
  };

  const updateMealOffer = async (newOfferMealId) => {
    try {
      // If there's already a meal set as the offer, remove the offer status
      if (currentOfferId) {
        await putReq(`meal/${currentOfferId}`, { offer: false });
      }

      // Then, set the new meal as the offer
      const response = await putReq(`meal/${newOfferMealId}`, { offer: true });
      if (response.status === 200) {
        setCurrentOfferId(newOfferMealId); // Update the state to reflect the new offer
        fetchMeals(chefId); // Refresh meals list to reflect these changes
      } else {
        // Handle failure
        console.error("Failed to update meal offer status:", response);
        alert("Could not set the new offer. Please try again.");
      }
    } catch (error) {
      console.error("Failed to update meal offer status:", error);
      handleShowModal("An error occurred while updating the offer. Please try again.");
    }
  };

  const handleRemoveOfferConfirmation = (mealId) => {
    setMealIdToConfirm(mealId); // Store the meal ID for later use
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  const confirmRemoveOffer = () => {
    if (mealIdToConfirm !== null) {
      removeMealOffer(mealIdToConfirm);
      setMealIdToConfirm(null); // Reset the meal ID to confirm
    }
    setShowConfirmationModal(false); // Hide the confirmation modal
  };

  const handleIncreaseFontSize = () => {
    setFontSize((currentSize) => {
      // Map the current size to the next larger size
      const sizeMap = {
        base: "sm", // base -> sm
        sm: "md", // sm -> md
        md: "lg", // md -> lg
        lg: "xl", // lg -> xl
        xl: "2xl", // xl -> 2xl
        "2xl": "3xl", // 2xl -> 3xl
        "3xl": "4xl", // 3xl -> 4xl
        "4xl": "5xl", // 4xl -> 5xl
        "5xl": "6xl", // 5xl -> 6xl
      };
      return sizeMap[currentSize] || "2xl"; // Default to '2xl' if currentSize is not in sizeMap
    });
  };

  const getFontSizeClass = (size) => {
    const sizeClasses = {
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      // ...add more sizes if needed
    };
    return sizeClasses[size] || sizeClasses.base; // Default to 'text-base' if size is not in sizeClasses
  };

  return (
    <div className='bg-custom-grey min-h-screen flex flex-col'>
      <Navbar />
      <div className='max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8'>
        <h2 className='text-4xl font-extrabold tracking-tight text-gray-900 text-center'>
          Your Store
        </h2>
        {successMessage && (
          <div className='bg-green-100 border-l-4 border-green-500 text-green-700 p-4' role='alert'>
            <p>{successMessage}</p>
          </div>
        )}

        {/* Buttons */}
        <div className='flex justify-center gap-4 my-4'>
          <button
            onClick={handleShow}
            className='text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-full px-6 py-3 transition duration-300 ease-in-out'
          >
            Edit your menu !!!
          </button>
          <button
            onClick={handleIncreaseFontSize}
            className='text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-full px-6 py-3 transition duration-300 ease-in-out'
          >
            Increase Font Size
          </button>
        </div>

        {/* Meals Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {meals.map((meal) => (
            <div
              key={meal.meal_id}
              className={`group relative border rounded-lg overflow-hidden shadow-lg ${
                currentOfferId === meal.meal_id ? "bg-green-100" : "bg-white"
              }`}
            >
              <img
                src={meal.imageUrl}
                alt={meal.name}
                className='w-full h-48 sm:h-64 object-cover'
              />
              <div className='p-4 space-y-2'>
                <h3 className='text-lg font-semibold text-gray-700'>
                  {meal.name.replace(/_/g, " ")}
                </h3>
                <p className='text-sm font-medium text-gray-900'>${meal.cost}</p>
                {/* Buttons */}
                <div className='flex gap-2'>
                  {/* Conditionally render buttons based on offer status */}
                  {!meal.offer && (
                    <button
                      onClick={() => handleOfferConfirmation(meal.meal_id)}
                      className='py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out'
                    >
                      Set as Today's Offer
                    </button>
                  )}
                  {meal.offer && (
                    <button
                      onClick={() => handleRemoveOfferConfirmation(meal.meal_id)}
                      className='text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full transition duration-300 ease-in-out'
                    >
                      Remove Offer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add and Delete Form */}
          <div className='flex items-center justify-center'>
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
                  {/* Add Form */}
                  <Tab eventKey='Add' title='Add' className='offbody'>
                    <form method='post' onSubmit={handleAdd} className='flex flex-col space-y-5'>
                      {/* Meal inputs */}
                      <div className='offInputs'>
                        <label>
                          Dish Name:
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
                        <button
                          type='submit'
                          className='mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg'
                        >
                          Add Meal and Upload Image
                        </button>
                      </div>
                    </form>
                  </Tab>
                  {/* Delete Form */}
                  <Tab eventKey='Delete' title='Delete' className='offbody'>
                    <form method='post' onSubmit={handleDelete} className='flex flex-col space-y-5'>
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
                      </div>
                      {/* Form submission button */}
                      <div className='form-actions'>
                        <button
                          type='submit'
                          className='mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg'
                        >
                          Remove Meal
                        </button>
                      </div>
                    </form>
                  </Tab>
                </Tabs>
              </Offcanvas.Body>
            </Offcanvas>
          </div>
        </div>
      </div>

      <div className='flex-grow'></div>

      {/* Footer */}
      <footer className='bg-gray-800 w-full py-4'>
        <p className='text-center text-sm text-gray-300'>
          Copyright © 2024 by WeBite.Inc. All rights reserved.
        </p>
      </footer>

      {/* Modal Component */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <button variant='secondary' onClick={() => setShowModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this meal from today’s offer?</Modal.Body>
        <Modal.Footer>
          <button variant='secondary' onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </button>
          <button variant='danger' onClick={() => confirmRemoveOffer()}>
            Confirm
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showOfferConfirmationModal} onHide={() => setShowOfferConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Offer Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentOfferId
            ? "Changing the offer. Are you sure?"
            : "Are you sure you want to set this meal as today’s offer?"}
        </Modal.Body>
        <Modal.Footer>
          <button variant='secondary' onClick={() => setShowOfferConfirmationModal(false)}>
            Cancel
          </button>
          <button variant='primary' onClick={() => confirmSetOffer()}>
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Chef;
