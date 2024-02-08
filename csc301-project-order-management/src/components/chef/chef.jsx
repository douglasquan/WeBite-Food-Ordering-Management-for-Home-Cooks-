import React from "react";

import './chef.css';
import Navbar from "../navbar/Navbar.jsx"
import { useParams } from 'react-router-dom';

function Chef() {
  const { buisnessID } = useParams();

  const menuItems = [
    { id: 1, name: 'Order 1', price: '$10.99' },
    { id: 2, name: 'Order 2', price: '$8.99' },
    { id: 3, name: 'Order 3', price: '$12.99' },
  
  ];


  return (
    <div> 
      <Navbar />

      <main>
        <h2 class="menu">Menu</h2>
        <div class="menu-container">
          <div class="column">
            <ul>
              {menuItems.map((item, index) => (
                <ul key={index} className="order-item">
                  <a class = "order" href={`/order/${item.id}`} className="order">
                    <span className="order-name">{item.name}</span>
                    <span className="order-price">{item.price}</span>
                  </a>
                </ul>
              ))}
            </ul>
          </div>

          <div class="column">
            <ul>
              {menuItems.map((item, index) => (
                <ul key={index} className="order-item">
                  <a class = "order" href={`/order/${item.id}`} className="order">
                    <span className="order-name">{item.name}</span>
                    <span className="order-price">{item.price}</span>
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
  
export default Chef;
