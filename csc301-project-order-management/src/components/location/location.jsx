import React, { useState } from 'react';
import Navbar from "../navbar/Navbar.jsx"
import { getReq, postReq } from "../view_control.js";

function Location() {
  const [formData, setFormData] = useState({
    city: '',
    latitude: '',
    longitude: '',
  });

  const [locations, setLocations] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use the postReq function for the POST request
    try {
      const data = await postReq('your_endpoint', formData); // Replace 'your_endpoint' with the actual endpoint suffix
      console.log(data); // Assuming you might do something with the data or adjust based on your needs
      setLocations(data); // Update locations state with the response
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="latitude">Latitude:</label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="longitude">Longitude:</label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Find Locations</button>
      </form>

      <div>
        {locations.length > 0 && (
          <div>
            <h2>Convenient Locations:</h2>
            {locations.map((location, index) => (
              <div key={index} className="location-info">
                <p><strong>Name:</strong> {location.name}</p>
                <p><strong>Address Line 1:</strong> {location.addressLine1}</p>
                <p><strong>Address Line 2:</strong> {location.addressLine2 || 'N/A'}</p>
                <p><strong>City:</strong> {location.city}</p>
                <p><strong>Province:</strong> {location.province}</p>
                <p><strong>Postal Code:</strong> {location.postalCode}</p>
                <p><strong>Country:</strong> {location.country}</p>
                <p><strong>Latitude:</strong> {location.latitude}</p>
                <p><strong>Longitude:</strong> {location.longitude}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Location;