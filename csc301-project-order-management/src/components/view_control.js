import axios from "axios";

// Function to create a post request
export const login_postReq = async (endpoint, data) => {
  try {
    const url = "/api/" + endpoint;
    // const url = 'http://localhost:14000/' + endpoint; // Point directly for testing
    const response = await axios.post(url, data, { withCredentials: true });
    console.log("login_postReq response " + response.data);
    return response; // Return the response object
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error to handle it where the function is called
  }
};

export const postReq = async (endpoint, data = {}) => {
  const url = "/api/" + endpoint;
  const config = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  };
  try {
    const response = await axios.post(url, JSON.stringify(data), config);
    console.log("postReq response " + response.data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postReqForm = async (endpoint, data) => {
  const url = "/api/" + endpoint;
  const config = {
    // When uploading files, content type should not be manually set. Remove it to allow the browser to set it with the correct boundary.
    headers: { "content-type": "multipart/form-data" },
    withCredentials: true,
  };
  try {
    // If it's a file, data should be a FormData object and not stringified.
    const response = await axios.post(url, data, config);
    console.log("postReqForm response " + response.data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getReq = async (endpoint) => {
  try {
    const url = "/api/" + endpoint;
    const response = await axios.get(url, { withCredentials: true });
    // console.log("getReq response " + response.data);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrowing the error or handling it appropriately
  }
};

export const getImage = async (mealId) => {
  try {
    const response = await axios.get("/api/image/" + mealId, {
      responseType: "blob", // This ensures the response is treated as a Blob
      withCredentials: true,
    });
    // No need to check response.ok (that's for fetch API) or create a Blob manually
    return URL.createObjectURL(response.data); // response.data is already a Blob
  } catch (error) {
    console.error(`Failed to fetch image for meal ${mealId}:`, error);
    return ""; // Return an empty string or a default image URL in case of error
  }
};

// Function to create a put request
export const putReq = async (endpoint, id, data) => {
  try {
    const url = "/api/" + endpoint + "?id=" + id;
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post('/api/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
        return response;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

// Function to create a delete request
// export const deleteReq = async (endpoint, id, data) => {
//     try {
//         // chef?id=1270780230
//         const url = '/api/' + endpoint + "?id=" + id;
//         console.log(data);
//         const response = await axios.delete(url, data);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// };
