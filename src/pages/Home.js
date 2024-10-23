// src/pages/Home.js
import React, { useState } from 'react';
import Menu from '../components/Menu';
import Cart from '../components/Cart';

const drinkData = [
  { id: 1, name: 'Margarita', price: 12.00 },
  { id: 2, name: 'Mojito', price: 10.00 },
  { id: 3, name: 'Daiquiri', price: 11.00 },
  { id: 4, name: 'Pina Colada', price: 12.50 },
];

function Home() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (drink) => {
    setCartItems((prevItems) => [...prevItems, drink]);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div>
      <h1>Menu Drinków</h1>
      <Menu drinks={drinkData} addToCart={addToCart} />
      <h2>Koszyk</h2>
      <Cart items={cartItems} removeFromCart={removeFromCart} clearCart={clearCart} />
      <button onClick={clearCart}>Zamów</button>
    </div>
  );
}

export default Home;