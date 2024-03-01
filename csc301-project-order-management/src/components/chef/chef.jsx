import React from "react"
import { useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import './chef.css';
import Navbar from "../navbar/Navbar.jsx"
import { getReq, postReq } from "../view_control.js";
import OffcanvasBody from "react-bootstrap/esm/OffcanvasBody.js";

// const getMenuData = async () => {
//   const chefID = "1";
//   const data = await getReq("meal/chef", chefID)
//   // console.log(data);
//   return data; 
// };

// var products = [];

// const UserInfo = JSON.parse(localStorage.getItem('user'));
// const chefID = UserInfo.chefID;

// if (chefID === null) {
//   products = [];
// } else {
//   const menuData = await getMenuData(); 
//   console.log(menuData);
// }

// console.log(UserInfo)
var UserInfo = null;
var chefID = null;
const Chef = () => {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchMenuData = async () => {
      UserInfo = JSON.parse(localStorage.getItem('user'));
      chefID = UserInfo?.chefid;
      console.log(chefID);
      if (chefID) {
        const menuData = await getReq("meal/chef", chefID);
        if (menuData !== null) {
          console.log(menuData);
          setProducts(menuData || []);
        } else {
          setProducts([]);
        }

      } else {
        setProducts([]);
      }
      // console.log(chefID);
    };

    fetchMenuData();
  }, []);
  
  // const products = [
  //   // Add your product details here
  //   { id: 1, name: "Show Me Your Love", price: 9.99, imageUrl: './food.jpg' },
  //   { id: 2, name: "Hong Kong Style Curry Beef Tendon Rice", price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1610266834410-0232b52c2c4a?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  //   { id: 3, name: "Poke Bowl", price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1609710219171-f86ae613c8d8?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  //   { id: 4, name: "Siu Mai", price: 9.99, imageUrl: 'https://plus.unsplash.com/premium_photo-1674601033631-79eeffaac6f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvbmclMjBrb25nJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D' },
  //   { id: 5, name: "Dim Sum", price: 9.99, imageUrl: 'https://plus.unsplash.com/premium_photo-1674601031608-1a38ca161523?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG9uZyUyMGtvbmclMjBmb29kfGVufDB8fDB8fHww' },
  //   { id: 6, name: "Hagao", price: 9.99, imageUrl: 'https://plus.unsplash.com/premium_photo-1674601033003-d028c1b148e6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvbmclMjBrb25nJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D' },
  //   { id: 7, name: "Ramen", price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1593906115209-6d0011a840e8?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  //   { id: 8, name: "Beef Brisket Noodle", price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1529690678884-189e81f34ef6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvbmclMjBrb25nJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D' },
  //   { id: 9, name: "Sweet and Sour Pork", price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1623689048105-a17b1e1936b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2hpbmVzZSUyMGZvb2R8ZW58MHx8MHx8fDA%3D' },
  //   { id: 10, name: "Pad thai", price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1637806930600-37fa8892069d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFkJTIwdGhhaXxlbnwwfHwwfHx8MA%3D%3D' },
  //   // ... other products
  // ];

  // products = [];


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAdd = async (event) => {
    // Prevent the browser from reloading the page
    event.preventDefault();

    // console.log(name);
    // console.log(price);

    const data = {"chef_id": chefID, "name": name, "cost": price};
    // console.log(data);
    const response = await postReq("meal/None", data);
    // const response = await getReq("meal", "1");
    // console.log(response);
  };

  const handleDelete = (event) => {
    // Prevent the browser from reloading the page
    event.preventDefault();

    console.log(name);
    console.log(price);

    const data = {"name": name, "cost": price};
    // postReq("chef", data);
  };

  const handleUpdate = (event) => {
    // Prevent the browser from reloading the page
    event.preventDefault();

    console.log(name);
    console.log(price);

    const data = {"name": name, "cost": price};
    // postReq("chef", data);
  };

  const reset = () => { 
    setName();
    setPrice();
  }


  return (
    <div className="bg-white">
      <Navbar />
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Your Store</h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    {product.name}
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.cost}</p>
              </div>
              {/* Edit button */}
              {/* <button className="absolute top-0 right-0 mt-2 mr-2 text-xs text-white bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded">
                Edit
              </button> */}
            </div>
          ))}
          {/* Add Product button */}
          <div className="flex items-center justify-center w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
            {/* <button className="text-gray-700 bg-transparent hover:bg-gray-300 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4v16m8-8H4"/>
              </svg>
            </button> */}
            <Button variant="primary" onClick={handleShow}>
              Edit your menu !!!
            </Button>

            <Offcanvas show={show} onHide={handleClose} placement="bottom" backdrop="static" scroll = {true}>
              <Offcanvas.Header className="offHeader" closeButton>
                MENU EDITS!!!
              </Offcanvas.Header>

    
              <Offcanvas.Body >
                <Tabs
                  defaultActiveKey="profile"
                  id="fill-tab-example"
                  className="mb-3"
                  fill
                >
                <Tab eventKey="Add" title="Add" className = "offbody">
                  <form method="post" onSubmit={handleAdd}>
                      <div className = 'offInputs'>
                        <label>
                          Dish Name: <input className = 'labelContainer' name="myInput" required onChange={(e) => setName(e.target.value)}/>
                        </label>
                        <hr />
                        <label>
                          Dish Price: <input className = 'labelContainer' name="myInput" required onChange={(e) => setPrice(e.target.value)}/>
                        </label>
                      </div>

                    <div className = "offButtons">
                      <button type="reset" onClick={reset} >Reset form</button>
                      <button type="submit">Submit form</button>
                    </div>
                  </form>
                </Tab>
                <Tab eventKey="Delete" title="Delete" className = "offbody">
                  <form method="post" onSubmit={handleDelete}>
                      <div className = 'offInputs'>
                        <label >
                          Dish Name: <input className = 'labelContainer' name="myInput" required onChange={(e) => setName(e.target.value)}/>
                        </label>
                        <hr />
                        <label >
                          Dish Price: <input className = 'labelContainer' name="myInput" required onChange={(e) => setPrice(e.target.value)}/>
                        </label>
                      </div>

                    <div className = "offButtons">
                      <button type="reset" onClick={reset} >Reset form</button>
                      <button type="submit">Submit form</button>
                    </div>
                  </form>
                </Tab>
                <Tab eventKey="Update" title="Update" className = "offbody">
                  <form method="post" onSubmit={handleUpdate}>
                      <div className = 'offInputs'>
                        <label>
                          Dish Name: <input className = 'labelContainer' name="myInput" required onChange={(e) => setName(e.target.value)}/>
                        </label>
                        <hr />
                        <label>
                          Dish Price: <input className = 'labelContainer' name="myInput" required onChange={(e) => setPrice(e.target.value)}/>
                        </label>
                      </div>

                    <div className = "offButtons">
                      <button type="reset" onClick={reset} >Reset form</button>
                      <button type="submit">Submit form</button>
                    </div>
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
