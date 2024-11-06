// src/components/Register.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import './Auth.css'; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Domyślnie ustawiamy rolę na 'user'
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Dodajemy dane użytkownika do Firestore z domyślną rolą
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role, // Zapisujemy rolę (admin lub user)
      });

      setError('');
    } catch (err) {
      setError('Błąd rejestracji: ' + err.message);
    }
  };

  return (
    <div>
      <h3>Zarejestruj się</h3>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Hasło:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Rola:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
          >
            <option value="user">Użytkownik</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        <button type="submit">Zarejestruj</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;