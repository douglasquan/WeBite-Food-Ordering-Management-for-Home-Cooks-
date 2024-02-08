// Function to fetch menu information from the backend for customer page
export const fetchMenu = async (chefID) => {
    try {
        const url = '/chef/' + chefID; 
        console.log(url)
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
        console.log("called");
        const name = "John doe";
        const phone_num = 1234567890;
        console.log(name);
        console.log(phone_num);
        console.log(username);
        console.log(password);
        const response = await fetch("http://127.0.0.1:14000/chef", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "name": name, "phone_num": phone_num, "email": username, "password": password}), // Your data to be sent to Flask backend
        });
        
        if (!response.ok) {
            throw new Error('Failed to create user');    
        }
        //  console.log(response);
        return await response.json();   
    } catch (error) {
        console.error('Error fetching menu:', error);
        throw error; // Rethrow the error to handle it where the function is called
    }
};


fetchMenu("1");