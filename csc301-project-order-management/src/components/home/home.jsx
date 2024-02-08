import { Link } from "react-router-dom";
import './home.css';
import Navbar from "../navbar/Navbar.jsx"

function Home() {
  return (
    <div className="App">
        <Navbar />
        <div className='chef-container'>
          <h1>CHEF CONTAINER</h1>
          <div className='chef-info'>
            <ul className='chef-list'>
              <li>
                <Link className="chef-link" to="/chef/001">Andi's Mexican Resturant</Link>
              </li>
              <li>
                <Link className="chef-link" to="/chef/002">Andi's Italian Resturant</Link>
              </li>
              <li>
                <Link className="chef-link" to="/chef/003">Andi's Chinese Resturant</Link>
              </li>
              <li>
                <Link className="chef-link" to="/chef/004">Andi's Cake Pastry</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='customer-container'>
          <h1>CUTSOMER CONTAINER</h1>
          <div className='customer-info'>
            <ul className='customer-list'>
                <li>
                    <Link className="customer-link" to="/customer/001">Micheal's Mushrooms</Link>
                </li>
                <li>
                  <Link className="customer-link" to="/customer/002">Sonya's Sushi</Link>
                </li>
                <li>
                  <Link className="customer-link" to="/customer/003">Bogdan's Blueberry Pie</Link>
                </li>
                <li>
                  <Link className="customer-link" to="/customer/004">Arnold's Avocado</Link>
                </li>
              </ul>
          </div>
        </div>
      </div>
  );
}

export default Home;

