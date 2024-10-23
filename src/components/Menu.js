// src/components/Menu.js
import React from 'react';

const Menu = ({ addToCart }) => {
  const drinks = [
    { 
      id: 1, 
      name: 'Mojito', 
      price: 8.0, 
      icon: '🍃', 
      ingredients: ['Rum', 'Cukier', 'Limonka', 'Mięta', 'Woda gazowana'] 
    },
    { 
      id: 2, 
      name: 'Pina Colada', 
      price: 10.0, 
      icon: '🍍', 
      ingredients: ['Rum', 'Kokos', 'Ananas', 'Śmietanka'] 
    },
    { 
      id: 3, 
      name: 'Cosmopolitan', 
      price: 9.0, 
      icon: '🍸', 
      ingredients: ['Wódka', 'Sok z limonki', 'Sok żurawinowy', 'Triple sec'] 
    },
    { 
      id: 4, 
      name: 'Whiskey Sour', 
      price: 7.5, 
      icon: '🥃', 
      ingredients: ['Whiskey', 'Sok z cytryny', 'Cukier', 'Białko jajka'] 
    },
    { 
      id: 5, 
      name: 'Daiquiri', 
      price: 9.0, 
      icon: '🍹', 
      ingredients: ['Rum', 'Sok z limonki', 'Cukier'] 
    },
    { 
      id: 6, 
      name: 'Martini', 
      price: 11.0, 
      icon: '🍸', 
      ingredients: ['Wódka', 'Vermouth', 'Olive'] 
    },
    { 
      id: 7, 
      name: 'Mai Tai', 
      price: 10.5, 
      icon: '🍹', 
      ingredients: ['Rum', 'Limonka', 'Orgeat syrup', 'Curacao'] 
    },
    { 
      id: 8, 
      name: 'Tequila Sunrise', 
      price: 8.0, 
      icon: '🍹', 
      ingredients: ['Tequila', 'Sok pomarańczowy', 'Grenadyna'] 
    },
    { 
      id: 9, 
      name: 'Blue Lagoon', 
      price: 9.0, 
      icon: '🌊', 
      ingredients: ['Wódka', 'Blue Curacao', 'Sok z cytryny'] 
    },
  ];

  return (
    <div className="menu">
      <h2>Menu</h2>
      <div className="menu-grid">
        {drinks.map(drink => (
          <div key={drink.id} className="menu-item">
            <h3>{drink.icon} {drink.name}</h3>
            <p>Cena: ${drink.price}</p>
            <h4>Składniki:</h4>
            <ul>
              {drink.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <button className="button" onClick={() => addToCart(drink)}>Dodaj do koszyka</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;