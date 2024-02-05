import './App.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import {
  HashRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

// import ListGroup from 'react-bootstrap/ListGroup';
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';
// import Particles from './components/ParticlesBG';
// import Carousel from 'react-bootstrap/Carousel';

import Chef from "./components/chef/chef.jsx";
// import Carts from "./components/Carts/.jsx";
// import Login from "./components/Login/chef.jsx";

import homePic from './image/logo.jpg';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" sticky = "top" expand = "sm" collapseOnSelect>
          <Container>
            <a href = 'home'>
            <Navbar.Brand href="#">{<img src = {homePic} width="75" alt="" />}</Navbar.Brand>
            </a>
            <Nav className="justify-content-end">
              <Nav.Link as={Link} to="/chef" >Chef</Nav.Link>
              {/* <Nav.Link as={Link} to="/Cart" >Cart</Nav.Link>
              <Nav.Link as={Link} to="/Login" >Log in</Nav.Link> */}
            </Nav>
          </Container>
        </Navbar>

          {/* Route components in a Routes component */}
          <Routes>
            {/* <Route path="/Cart" element={<About />} />
            <Route path="/Login" element={<ContactUs />} /> */}
            <Route path="/chef" element={<Chef />} />
            {/* <Route path="/" element={<Landing />} /> */}
          </Routes>
      </div>
    </Router>

  );
}

export default App;
