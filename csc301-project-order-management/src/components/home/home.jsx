import { Link } from "react-router-dom";
 
import Navbar from "../navbar/Navbar.jsx"

function Home() {
  return (
    <div className="App">
        <Navbar />
        <div className='chef-container'>
          <h1>chef container</h1>
          <div className='chef-info'>
            <ul className='chef-list'>
              <li>
                <Link to="/customer">customer</Link>
              </li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
            </ul>
          </div>
        </div>
        <div className='customer-container'>
          <h1>customer container</h1>
          <div className='customer-info'>
            <ul className='customer-list'>
                <li>
                    <Link to="/chef">chef</Link>
                </li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
              </ul>
          </div>
        </div>
      </div>
  );
}

export default Home;

