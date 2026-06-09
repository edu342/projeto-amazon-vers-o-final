import { renderOrderSumary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
// import '../data/cart-class.js';
import { loadProducts, loadProductsFeth } from '../data/products.js';
import { loadCart } from '../data/cart.js';

Promise.all([
  loadProductsFeth(),
 new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  })

]).then(() => {
  renderOrderSumary();
  renderPaymentSummary();
});

/*
new Promise((resolve) => {
  loadProducts(() => {
    resolve('value1');
  });
}).then((value) => {
  return new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  });
}).then(() => {
   renderOrderSumary();
   renderPaymentSummary();
});
*/




/*
loadProducts(() => {
  loadCart(() => {
    renderOrderSumary();
    renderPaymentSummary();
  });
});
*/