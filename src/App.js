// src/App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import { db, auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getDoc, doc, addDoc, collection } from 'firebase/firestore'; // Importy Firebase Firestore
import './App.css';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);  // Stan przechowujący użytkownika
  const [isAdmin, setIsAdmin] = useState(false); // Stan przechowujący rolę użytkownika (admin)

  const drinks = [
    { name: 'Mojito', ingredients: ['Rum', 'Cukier', 'Limonka', 'Mięta', 'Woda gazowana'], price: 10.0 },
    // ... (pozostałe drinki)
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user); // Ustawiamy zalogowanego użytkownika
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true); // Jeśli użytkownik jest administratorem, ustawiamy odpowiedni stan
        } else {
          setIsAdmin(false); // Jeśli użytkownik nie jest administratorem, ustawiamy odpowiedni stan
        }
      } else {
        setUser(null); // Jeśli użytkownik się wylogował, ustawiamy stan na null
        setIsAdmin(false); // Resetujemy rolę administratora
      }
    });

    return () => unsubscribe();
  }, []);

  const addToCart = (drink) => {
    setCartItems((prevItems) => [...prevItems, drink]);
  };

  const removeFromCart = (drink) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.name !== drink.name));
  };

  const addOrderToFirestore = async (order) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), order);
      console.log('Zamówienie dodane z ID: ', docRef.id);
    } catch (e) {
      console.error('Błąd dodawania zamówienia: ', e);
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

  const handleSignOut = async () => {
    await signOut(auth); // Wyloguj użytkownika
  };

  return (
    <div className="app">
      <Header />
      {!user ? (
        <div className="auth-container">
          <h2>Proszę się zalogować lub zarejestrować</h2>
          <Login onLoginSuccess={() => setUser(auth.currentUser)} /> {/* Komponent logowania */}
          <Register /> {/* Komponent rejestracji */}
        </div>
      ) : (
        <div>
          {isAdmin ? (
            <AdminPanel /> // Komponent panelu administratora
          ) : (
            <div>
              <h2>Menu Drinków</h2>
              <Menu drinks={drinks} addToCart={addToCart} />
              <Cart cartItems={cartItems} removeFromCart={removeFromCart} placeOrder={placeOrder} />
            </div>
          )}
          <button onClick={handleSignOut}>Wyloguj</button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default App;