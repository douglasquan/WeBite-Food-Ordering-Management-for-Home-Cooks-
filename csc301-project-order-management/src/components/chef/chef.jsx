import React from "react"
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import './chef.css';
import Navbar from "../navbar/Navbar.jsx"
import { getReq, postReq } from "../view_control.js";
import OffcanvasBody from "react-bootstrap/esm/OffcanvasBody.js";

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
  const handleAdd = (event) => {
    // Prevent the browser from reloading the page
    event.preventDefault();

    console.log(name);
    console.log(price);

    const data = {"name": name, "price": price};
    // postReq("chef", data);
  }

  const handleDelete = (event) => {
    // Prevent the browser from reloading the page
    event.preventDefault();

    console.log(name);
    console.log(price);

    const data = {"name": name, "price": price};
    // postReq("chef", data);
  }

  const handleUpdate = (event) => {
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
            
              {menuItems.map((item, index) => (
                <ul key={index} className="order-item">
                  <a class = "order" href={`/order/${item.id}`} className="order">
                    <span className="order-name">{item.name}</span>
                    <span className="order-price">{item.price}</span>
                  </a>
                </ul>
              ))}
            
          </div>

          <div class="column">
            
              {menuItems.map((item, index) => (
                <ul key={index} className="order-item">
                  <a class = "order" href={`/order/${item.id}`} className="order">
                    <span className="order-name">{item.name}</span>
                    <span className="order-price">{item.price}</span>
                  </a>
                </ul>
              ))}
            
          </div>
        </div>
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
                      Dish Name: <input name="myInput" required onChange={(e) => setName(e.target.value)}/>
                    </label>
                    <hr />
                    <label>
                      Dish Price: <input name="myInput" required onChange={(e) => setPrice(e.target.value)}/>
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
                    <label>
                      Dish Name: <input name="myInput" required onChange={(e) => setName(e.target.value)}/>
                    </label>
                    <hr />
                    <label>
                      Dish Price: <input name="myInput" required onChange={(e) => setPrice(e.target.value)}/>
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
                      Dish Name: <input name="myInput" required onChange={(e) => setName(e.target.value)}/>
                    </label>
                    <hr />
                    <label>
                      Dish Price: <input name="myInput" required onChange={(e) => setPrice(e.target.value)}/>
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


      </main>


    </div>
  );
}
  
export default Chef;




// <Tabs
// defaultActiveKey="profile"
// id="fill-tab-example"
// className="mb-3"
// >
// <Tab eventKey="add" title="add">
//   <form method="post" onSubmit={handleSubmit}>
//     <label>
//       Dish Name: <input name="myInput" required onChange={(e) => setName(e.target.value)}/>
//     </label>
//     <hr />
//     <label>
//       Dish Price: <input name="myInput" required onChange={(e) => setPrice(e.target.value)}/>
//     </label>
//     <div className = "offButtons">
//       <button type="reset" onClick={reset} >Reset form</button>
//       <button type="submit">Submit form</button>
//     </div>
//   </form>
// </Tab>
// <Tab eventKey="profile" title="Profile">
//   Tab content for Profile
// </Tab>
// <Tab eventKey="contact" title="Contact">
//   Tab content for Contact
// </Tab>
// </Tabs>