import React from "react";
import Navbar from "../navbar/Navbar.jsx"
import { items } from "../customer/customer.jsx";
import { postReq } from "../view_control.js";

const UserInfo = JSON.parse(localStorage.getItem('user'));
const chefID = UserInfo?.chefid;
const customerid = UserInfo?.custid;
// console.log(UserInfo);
const checkout = async () => {
  const data = {"chefid": chefID, "custid": customerid, "mealid": 1, "quantity": 1, "price": items[0].cost};
  const response = await postReq("order", data);

  console.log(response);
}


const Cart = () => {
  // Check if props.location is defined before accessing its state

  return (
    <div> 
      <Navbar />
      <main>
        <br />
        <h2 className="cart">Cart</h2>
        <div className="cart-container">
          <div className="bg-white rounded shadow p-4 block text-center">
              {/* Check if menuItems is not empty before mapping */}
              {items && items.map((item, index) => (
                <ul key={index} className="order-item">
                    <span className="order-name">{item.name}</span>
                    <br />
                    <span className="order-price">{item.cost}</span>
                </ul>
              ))}
          </div>
        </div>
        <br />
        <button onClick = {checkout} classname="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0">Checkout</button>
      </main>
    </div>
  );
}
  
export default Cart;