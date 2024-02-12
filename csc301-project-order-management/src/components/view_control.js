import axios from 'axios';

// Function to fetch menu information from the backend for customer page
export const fetchMenu = async (chefID) => {
    try {
        // const url = '/chef/' + chefID; 
        //console.log(url)
        // const response = await fetch('/chef/1'); // Adjust the API endpoint according to your Flask backend route
        // if (!response.ok) {
        // throw new Error('Failed to fetch menu');    
        // }
        // return await response.json();
    } catch (error) {
        console.error('Error fetching menu:', error);
        throw error; // Rethrow the error to handle it where the function is called
    }
};


// Function to createUser and update databases
export const createUser = async (username, password) => {
    try {
        const name = "John doe";
        const phone_num = 1234567890;
        console.log(name);
        console.log(phone_num);
        console.log(username);
        console.log(password);

        const response = "";
        //'/api/14000/chef'
        axios.post(`/api/chef`, {
            "name": name,
            "phone_num": phone_num,
            "email": username,
            "password": password
        })
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


fetchMenu("1");