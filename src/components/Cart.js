// src/components/Cart.js
import React from 'react';

const Cart = ({ cartItems, removeFromCart, placeOrder }) => {
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="cart">
      <h2>Koszyk</h2>
      {cartItems.length === 0 ? (
        <p>Twój koszyk jest pusty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                <h3>{item.name}</h3>
                <p>Składniki: {item.ingredients.join(', ')}</p>
                <p>Cena: ${item.price.toFixed(2)}</p>
                <button onClick={() => removeFromCart(item)}>Usuń</button>
              </li>
            ))}
          </ul>
          <h3>Łączna cena: ${totalPrice.toFixed(2)}</h3>
          <button className="button" onClick={placeOrder}>Złóż zamówienie</button>
        </div>
      )}
    </div>
  );
};

export default Cart;