import axios from 'axios';

// Function to create a post request
export const login_postReq = async (endpoint, data) => {
    try {
        const url = '/api/' + endpoint;
        // const url = 'http://localhost:14000/' + endpoint; // Point directly for testing
        const response = await axios.post(url, data, { withCredentials: true });
        console.log(response.data);
        return response; // Return the response object
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error to handle it where the function is called
    }
};

export const postReq = async (endpoint, data = {}) => {
    const url = '/api/' + endpoint;
    const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    };
    try {
        console.log(data);
        const response = await axios.post(url, JSON.stringify(data), config);
        console.log(response.data);
        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getReq = async (endpoint) => {
    try {
        const url = '/api/' + endpoint;
        const response = await axios.get(url, { withCredentials: true });
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrowing the error or handling it appropriately
    }
};



// // Function to create a get request
// export const getReq = async (endpoint, id) => {
//     try {
//         const url = '/api/' + endpoint + "?id=" + id;
//         console.log(url);
//         const response = await axios.get(url);
//         console.log(response);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return "invalid user";
//     }
// };

// Function to create a get request with multiple params
export const multiGetReq = async (endpoint, id) => {
    try {
        const url = '/api/' + endpoint + "?" + id;
        const response = await axios.get(url);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return "invalid user";
    }
};

// Function to create a put request
export const putReq = async (endpoint, id, data) => {
    try {
        const url = '/api/' + endpoint + "?id=" + id;
        const response = await axios.put(url, data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
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