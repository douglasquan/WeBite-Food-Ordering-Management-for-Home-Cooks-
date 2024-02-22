import React from "react"
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import './chef.css';
import Navbar from "../navbar/Navbar.jsx"
import { getReq, postReq } from "../view_control.js";

function Chef() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");



  // var id = '1';
  // const menuData = getReq("chef", id);

  const menuItems = [
    { id: 1, name: 'Order 1', price: '$10.99' },
    { id: 2, name: 'Order 2', price: '$8.99' },
    { id: 3, name: 'Order 3', price: '$12.99' },
  ];

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (event) => {
    // Prevent the browser from reloading the page
    event.preventDefault();

    console.log(name);
    console.log(price);

    const data = {"name": name, "price": price};
    // postReq("chef", data);
  }

  const reset = () => { 
    setName();
    setPrice();
  }


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

        <Button variant="primary" onClick={handleShow}>
          Toggle static offcanvas
        </Button>


        <Offcanvas className="offcontainer" show={show} onHide={handleClose} placement={"bottom"} backdrop="static">
          <Offcanvas.Header className="offclose" closeButton>
            Edit Your Menu !!!
          </Offcanvas.Header>
          <Offcanvas.Body className="offbody">
            <form method="post" onSubmit={handleSubmit}>
              <label>
                Dish Name: <input name="myInput" required onChange={(e) => setName(e.target.value)}/>
              </label>
              <hr />
              <label>
                Dish Price: <input name="myInput" required onChange={(e) => setPrice(e.target.value)}/>
              </label>
              <button type="reset" onClick={reset} >Reset form</button>
              <button type="submit">Submit form</button>
            </form>

 
            
          </Offcanvas.Body>
        </Offcanvas>


      </main>


    </div>
  );
}
  
export default Chef;
{/* <Button variant="primary" onClick={addItem}>
I will not close if you click outside of me.
</Button>  */}