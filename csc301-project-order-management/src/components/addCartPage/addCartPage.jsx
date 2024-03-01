import React from "react";
import './addCartPage.css';
import Navbar from "../navbar/Navbar.jsx"
import { addedItems } from "../customer/customer.jsx";

const AddCart = () => {
  // Check if props.location is defined before accessing its state

  return (
    <div> 
      <Navbar />
      <main>
        <h2 className="cart">Cart</h2>
        <div className="cart-container">
          <div className="column">
              {/* Check if menuItems is not empty before mapping */}
              {addedItems && addedItems.map((item, index) => (
                <ul key={index} className="order-item">
                    <span className="order-name">{item.name}</span>
                    <span className="order-price">{item.price}</span>
                </ul>
              ))}
          </div>
        </div>
        <button>Checkout</button>
      </main>
    </div>
  );
}
  
export default AddCart;