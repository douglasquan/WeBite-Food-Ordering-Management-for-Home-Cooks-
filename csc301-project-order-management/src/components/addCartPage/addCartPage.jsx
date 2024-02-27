import React from "react"

import './addCartPage.css';
import Navbar from "../navbar/Navbar.jsx"

function AddCart() {
  const menuItems = [
    { id: 1, name: 'Order 1', price: '$10.99' },
    { id: 2, name: 'Order 2', price: '$8.99' },
    { id: 3, name: 'Order 3', price: '$12.99' },
  
  ];


  return (
    <div> 
      <Navbar />
      <main>
        <h2 class="cart">Cart</h2>
        <div class="cart-container">
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
  
export default AddCart;
