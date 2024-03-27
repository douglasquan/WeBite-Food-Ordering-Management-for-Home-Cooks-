import React, {useEffect, useState} from 'react';
import Navbar from "../navbar/Navbar.jsx"
import { getReq, postReq, postReq2 } from "../view_control.js";
import './location.css'
import axios from "axios";

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
    // try {
    //   const data = await postReq2('address/convenience', formData);
    //   if (data !== null) {
    //   console.log("data is: ", data);
    //   setLocations(data||[]);} // Update locations state with the response
    // } catch (error) {
    //   console.error('Error:', error);
    // }
   fetch('/api/address/convenience', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      setLocations(data); // Assuming the response is an array of locations
    })
    .catch(error => console.error('Error:', error));
  };

//   useEffect(() => {
//   console.log("Locations updated:", locations);
// }, [locations]);
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
          <p><strong>Unit number:</strong> {location.unit_number}</p>
          <p><strong>Street number:</strong> {location.street_number}</p>
          <p><strong>Address Line 1:</strong> {location.address_line1}</p>
          <p><strong>Address Line 2:</strong> {location.address_line2 || 'N/A'}</p>
          <p><strong>City:</strong> {location.city}</p>
          <p><strong>Province:</strong> {location.province}</p>
          <p><strong>Postal Code:</strong> {location.postal_code}</p>
          <p><strong>Country:</strong> {location.country}</p>
          <p><strong>Latitude:</strong> {location.latitude}</p>
          <p><strong>Longitude:</strong> {location.longitude}</p>
            <p>And</p>
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  );
}

export default Location;