import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import CreateAccount from './CreateAccount';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="//create-account" element={<CreateAccount />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;