import React, { useState } from "react"

import './customer.css';
import Navbar from "../navbar/Navbar.jsx"
import { Link } from "react-router-dom";
var addedItems = [];
function Customer() {

  const handleAddItem = (item) => {
    addedItems.push(item)
    console.log(item)
    //return <Link to={{ pathname: "/addCartPage", state: { addedItems } }} />
  };

  const menuItems = [
    { id: 1, name: 'Dish 1', price: '$10.99' },
    { id: 2, name: 'Dish 2', price: '$8.99' },
    { id: 3, name: 'Dish 3', price: '$12.99' },
    { id: 3, name: 'Dish 3', price: '$12.99' },
    { id: 3, name: 'Dish 3', price: '$12.99' },
    { id: 3, name: 'Dish 3', price: '$12.99' },
    { id: 3, name: 'Dish 3', price: '$12.99' },
    { id: 3, name: 'Dish 3', price: '$12.99' },
    { id: 3, name: 'Dish 3', price: '$12.99' },
    { id: 3, name: 'Dish 3', price: '$12.99' },
    // Add more dishes as needed
  ];


  return (
    <div>
      <Navbar />

      <main>
        <h2 class="menu">Menu</h2>
        <div class="menu-container">
          <div class="menu-column">
              {menuItems.map((item, index) => (
                <ul key={index} className="menu-item">
                  <a href={`/dish/${item.id}`} className="dish-link">
                    <span className="dish-name">{item.name}</span>
                    <span className="dish-price">{item.price}</span>
                    <Link to="/addCartPage" onClick={() => handleAddItem(item)}>Add to Cart</Link>
                  </a>
                </ul>
              ))}
          </div>

          <div class="menu-column">
              {menuItems.map((item, index) => (
                <ul key={index} className="menu-item">
                  <a href={`/dish/${item.id}`} className="dish-link">
                    <span className="dish-name">{item.name}</span>
                    <span className="dish-price">{item.price}</span>
                    <Link to="/addCartPage" onClick={() => handleAddItem(item)}>Add to Cart</Link>
                  </a>
                </ul>
              ))}
          </div>

        </div>
      </main>
      
    </div>
  );
}
  
export {addedItems};
export default Customer;