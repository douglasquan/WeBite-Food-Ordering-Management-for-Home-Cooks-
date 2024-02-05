import React from "react"
import Badge from 'react-bootstrap/Badge';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

import './chef.css';

function Chef() {
  const menuItems = [
    { id: 1, name: 'Order 1', price: '$10.99' },
    { id: 2, name: 'Order 2', price: '$8.99' },
    { id: 3, name: 'Order 3', price: '$12.99' },
  
  ];


  return (
    <div>
      <header>
        <h1 class="main-header">weBite | Chef View Page</h1>
      </header>

      <main>
        <h2 class="menu">Menu</h2>
        <div class="menu-container">
          <div class="column">
              {menuItems.map((item, index) => (
                  <a class = "order" href={`/order/${item.id}`} className="order">
                    <span className="order-name">{item.name}</span>
                    <span className="order-price">{item.price}</span>
                  </a>
              ))}
          </div>

          <div class="column">
              {menuItems.map((item, index) => (
                  <a href={`/order/${item.id}`} className="order">
                    <span className="order-name">{item.name}</span>
                    <span className="order-price">{item.price}</span>
                  </a>
              ))}
          </div>
        </div>
      </main>


    </div>
  );
}
  
export default Chef;