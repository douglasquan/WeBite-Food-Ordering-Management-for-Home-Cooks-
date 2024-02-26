import React from 'react';
import Navbar from "../navbar/Navbar.jsx";
import './customer.css'
import backgroundImage from './hero.jpg';

const products = [
  // Add your product details here
  { id: 1, name: "Show Me Your Love", price: 9.99, imageUrl: './food.jpg' },
  { id: 2, name: "Hong Kong Style Curry Beef Tendon Rice", price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1610266834410-0232b52c2c4a?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 3, name: "Poke Bowl", price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1609710219171-f86ae613c8d8?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 4, name: "Siu Mai", price: 9.99, imageUrl: 'https://plus.unsplash.com/premium_photo-1674601033631-79eeffaac6f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvbmclMjBrb25nJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 5, name: "Dim Sum", price: 9.99, imageUrl: 'https://plus.unsplash.com/premium_photo-1674601031608-1a38ca161523?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG9uZyUyMGtvbmclMjBmb29kfGVufDB8fDB8fHww' },
  { id: 6, name: "Hagao", price: 9.99, imageUrl: 'https://plus.unsplash.com/premium_photo-1674601033003-d028c1b148e6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvbmclMjBrb25nJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 7, name: "Ramen", price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1593906115209-6d0011a840e8?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 8, name: "Beef Brisket Noodle", price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1529690678884-189e81f34ef6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvbmclMjBrb25nJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 9, name: "Sweet and Sour Pork", price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1623689048105-a17b1e1936b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2hpbmVzZSUyMGZvb2R8ZW58MHx8MHx8fDA%3D' },
  { id: 10, name: "Pad thai", price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1637806930600-37fa8892069d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFkJTIwdGhhaXxlbnwwfHwwfHx8MA%3D%3D' },
  // ... other products
];

const HeroSection = () => {
  return (
    <div className="relative text-white text-center py-36 px-12">
      <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${backgroundImage})`, backdropFilter: 'blur(0px)' }}></div>
      {/* Content Overlay */}
      <div className="relative z-10">
        <h1 className="text-7xl font-bold mb-4" style={{ textShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)' }}>Quan's Kitchen</h1>
      </div>
    </div>
  );
};


const Customer = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <HeroSection />
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img
                  src={product.imageUrl}
                  className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Customer;