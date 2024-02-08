import React from "react"

import { useEffect, useState } from "react";
import { fetchMenu } from "../view_control.js";

import './customer.css';
import Navbar from "../navbar/Navbar.jsx"

function Customer() {


  const [menuItem, setMenuItems] = useState([]);
  useEffect(() => {
    // Pass variables into fetchMenu
    fetchMenu('1')
      .then(data => {
        setMenuItems(data);
      })
      .catch(error => {
        console.error('Error fetching menu:', error);
      });
  }, []);

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