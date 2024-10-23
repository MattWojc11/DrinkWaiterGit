// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Menu from './components/Menu';
import Cart from './components/Cart';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import './App.css';

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const drinks = [
    {
      name: 'Mojito',
      ingredients: ['Rum', 'Cukier', 'Limonka', 'Mięta', 'Woda gazowana'],
      price: 10.0,
    },
    // ... (pozostałe drinki)
  ];

  const addToCart = (drink) => {
    setCartItems((prevItems) => [...prevItems, drink]);
  };

  const removeFromCart = (drink) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.name !== drink.name));
  };

  const addOrderToFirestore = async (order) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), order);
      console.log("Zamówienie dodane z ID: ", docRef.id);
    } catch (e) {
      console.error("Błąd dodawania zamówienia: ", e);
    }
  };

  const placeOrder = async () => {
    const order = {
      items: cartItems,
      total: cartItems.reduce((acc, item) => acc + item.price, 0),
      createdAt: new Date(),
    };

    await addOrderToFirestore(order);
    alert('Zamówienie zostało złożone!');
    setCartItems([]); // Wyczyść koszyk po złożeniu zamówienia
  };

  return (
    <div className="app">
      <Header />
      <Menu drinks={drinks} addToCart={addToCart} />
      <Cart cartItems={cartItems} removeFromCart={removeFromCart} placeOrder={placeOrder} />
      <Footer />
    </div>
  );
};

export default App;