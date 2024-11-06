import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import './AdminPanel.css';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]); // Bieżące zamówienia
  const [orderHistory, setOrderHistory] = useState([]); // Historia zamówień
  const [selectedOrder, setSelectedOrder] = useState(null); // Wybrane zamówienie
  const [payment, setPayment] = useState(''); // Kwota zapłacona przez klienta
  const [change, setChange] = useState(null); // Wyliczona reszta

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersList = [];
      querySnapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersList);
    };
    fetchOrders();
  }, []);

  // Obsługa klawiatury numerycznej
  const handleNumPadClick = (value) => {
    setPayment((prev) => prev + value);
  };

  // Funkcja do usuwania ostatniego wpisu
  const handleBackspace = () => {
    setPayment((prev) => prev.slice(0, -1));
  };

  // Funkcja do obliczania reszty
  const calculateChange = (total) => {
    const paidAmount = parseFloat(payment);
    const changeAmount = paidAmount - total;
    setChange(changeAmount.toFixed(2));
  };

  // Potwierdzenie zamówienia i przeniesienie go do historii
  const confirmOrder = async () => {
    if (!selectedOrder) return; // Jeśli brak wybranego zamówienia, nie wykonuj operacji

    const confirmedOrder = { ...selectedOrder, status: 'zrealizowane' };

    // Zaktualizowanie statusu zamówienia w bazie danych
    const orderRef = doc(db, 'orders', selectedOrder.id);
    await updateDoc(orderRef, { status: 'zrealizowane' });

    setOrderHistory((prevHistory) => [...prevHistory, confirmedOrder]); // Dodanie do historii
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== selectedOrder.id)); // Usunięcie z bieżących zamówień
    setSelectedOrder(null); // Zresetowanie wybranego zamówienia
    setPayment(''); // Reset kwoty zapłaconej
    setChange(null); // Reset reszty
  };

  // Funkcja generująca fakturę
  const printInvoice = (order, orderNumber) => {
    // Obliczanie reszty przed wydrukiem faktury
    calculateChange(order.total);

    const invoiceWindow = window.open('', 'PRINT', 'height=600,width=800');
    invoiceWindow.document.write('<html><head><title>Faktura</title>');
    invoiceWindow.document.write('<style>');
    invoiceWindow.document.write(`
      body { font-family: Arial, sans-serif; color: #333; padding: 20px; }
      h1 { color: #ffcc00; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
      th { background-color: #f0f0f0; }
      .total, .paid, .change { font-weight: bold; color: #ffcc00; }
    `);
    invoiceWindow.document.write('</style></head><body>');
    invoiceWindow.document.write(`<h1>Faktura - Zamówienie #${orderNumber}</h1>`);
    invoiceWindow.document.write('<table>');
    invoiceWindow.document.write('<tr><th>Produkt</th><th>Cena (zł)</th></tr>');

    order.items.forEach((item) => {
      invoiceWindow.document.write(`<tr><td>${item.name}</td><td>${item.price.toFixed(2)} zł</td></tr>`);
    });

    invoiceWindow.document.write(`<tr><td class="total">Razem:</td><td class="total">${order.total.toFixed(2)} zł</td></tr>`);
    invoiceWindow.document.write(`<tr><td class="paid">Zapłacono:</td><td class="paid">${payment} zł</td></tr>`);
    invoiceWindow.document.write(`<tr><td class="change">Reszta:</td><td class="change">${change} zł</td></tr>`);
    invoiceWindow.document.write('</table>');
    invoiceWindow.document.write('</body></html>');

    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  return (
    <div className="admin-panel">
      <h2>Panel Administratora</h2>

      {/* Sekcja Bieżących Zamówień */}
      <h3>Bieżące Zamówienia:</h3>
      <div className="orders-list">
        {orders.map((order, index) => (
          <div
            className={`order-card ${order.status === 'zrealizowane' ? 'completed' : ''}`} // Dodanie klasy w zależności od statusu
            key={order.id}
            onClick={() => setSelectedOrder(order)} // Ustawiamy wybrane zamówienie
          >
            <p className="order-title">Zamówienie {index + 1}</p>
            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <span>{item.name}</span>
                  <span>{item.price} zł</span>
                </div>
              ))}
            </div>
            <p className="order-total">Razem: {order.total} zł</p>
            {order.status === 'zrealizowane' && <p className="order-status">Zrealizowane</p>} {/* Dodatkowy tekst */}
          </div>
        ))}
      </div>

      {/* Sekcja wybranego zamówienia */}
      {selectedOrder && (
        <div className="selected-order">
          <h3>Wybrane Zamówienie</h3>
          <p className="order-title">Zamówienie</p>
          <div className="order-items">
            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className="order-item">
                <span>{item.name}</span>
                <span>{item.price} zł</span>
              </div>
            ))}
          </div>
          <p className="order-total">Razem: {selectedOrder.total} zł</p>

          {/* Klawiatura numeryczna */}
          <div className="numpad">
            <h4>Kwota zapłacona</h4>
            <div className="numpad-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <button key={num} onClick={() => handleNumPadClick(num.toString())}>{num}</button>
              ))}
              <button onClick={handleBackspace}>⌫</button>
              <button onClick={() => calculateChange(selectedOrder.total)}>Oblicz resztę</button>
            </div>
            <p>Kwota zapłacona: {payment} zł</p>
            <p>Reszta: {change !== null ? `${change} zł` : '---'}</p>

            {/* Generowanie faktury i potwierdzenie zamówienia */}
            <button className="button" onClick={() => printInvoice(selectedOrder, orders.indexOf(selectedOrder) + 1)}>
              Generuj Fakturę
            </button>
            <button className="button" onClick={confirmOrder}>
              Potwierdź Zamówienie
            </button>
          </div>
        </div>
      )}

      {/* Sekcja Historii Zamówień */}
      <h3>Historia Zamówień:</h3>
      <div className="orders-list">
        {orderHistory.map((order, index) => (
          <div className="order-card history-card" key={index}>
            <p className="order-title">Zamówienie {orders.length + index + 1}</p> {/* Numeracja w historii */}
            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <span>{item.name}</span>
                  <span>{item.price} zł</span>
                </div>
              ))}
            </div>
            <p className="order-total">Razem: {order.total} zł</p>
            {order.status === 'zrealizowane' && <p className="order-status">Zrealizowane</p>} {/* Dodatkowy tekst */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;