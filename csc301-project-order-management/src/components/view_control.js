import axios from 'axios';

// Function to create a post request
export const postReq = async (endpoint, data) => {
    try {
        const response = "";
        const url = '/api/' + endpoint;
        axios.post(url, data)
            .then(response => {
            console.log(response.data);
        })
            .catch(error => {
            console.error('Error:', error);
        });
        return response;    
        //return await response.json();   
    } catch (error) {
        console.error('Error fetching menu:', error);
        throw error; // Rethrow the error to handle it where the function is called
    }
};


// Function to create a get request
export const getReq = async (endpoint, id) => {
    try {
        const url = '/api/' + endpoint + "?id=" + id;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
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