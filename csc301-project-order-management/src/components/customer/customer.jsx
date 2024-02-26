import React from "react"

import './customer.css';
import Navbar from "../navbar/Navbar.jsx"
import { Link } from "react-router-dom";

function Customer() {
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
            <ul>
              {menuItems.map((item, index) => (
                <ul key={index} className="menu-item">
                  <a href={`/dish/${item.id}`} className="dish-link">
                    <span className="dish-name">{item.name}</span>
                    <span className="dish-price">{item.price}</span>
                    <button><a id="link" href="AddCart">Add to Cart</a></button>
                  </a>
                </ul>
              ))}
            </ul>
          </div>

          <div class="menu-column">
            <ul>
              {menuItems.map((item, index) => (
                <ul key={index} className="menu-item">
                  <a href={`/dish/${item.id}`} className="dish-link">
                    <span className="dish-name">{item.name}</span>
                    <span className="dish-price">{item.price}</span>
                    <button><a id="link" href="AddCart">Add to Cart</a></button>
                  </a>
                </ul>
              ))}
            </ul>
          </div>

        </div>
      </main>


    </div>
  );
}
  
export default Customer;