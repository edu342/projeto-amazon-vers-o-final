import { cart, removeFromCart, getTotalQuantity, updateCart, saveToStorage, updateDeliveryOption } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { renderPaymentSummary } from './paymentSummary.js';


function updateCartQuantityHTML() {
  const totalElement = document.querySelector('.return-to-home-link');
  if (totalElement) {
    totalElement.innerHTML = `${getTotalQuantity()} items`;
    
  }
  saveToStorage()
}

export function renderOrderSumary(){
  let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
      const productId = cartItem.productId;

      let matchingProduct = getProduct(productId);
      if (!matchingProduct) return;
     
      const deliveryOptionId = cartItem.deliveryOptionId;

      const today = dayjs();
    let dateString = '';

   const deliveryOption = getDeliveryOption(deliveryOptionId);
     
   const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        dateString = deliveryDate.format('dddd, MMMM D'); // ✅ atribui, não declara

      cartSummaryHTML += `
        <div class="cart-item-container 
        js-cart-item-container
        js-cart-item-container-${matchingProduct.id}">
          <div class="delivery-date">
          Delivery date: ${dateString}
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}">

            <div class="cart-item-details">
              <div class="product-name">${matchingProduct.name}</div>
              <div class="product-price">
                ${matchingProduct.getPrice()}
              </div>
              <div class="product-quantity
              js-product-quantity-${matchingProduct.id}">
                <span>
                  Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-link"
                  data-product-id="${matchingProduct.id}">Update</span>
                <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                <span class="save-quantity-link link-primary js-save-link"
                  data-product-id="${matchingProduct.id}">Save</span>
                <span class="delete-quantity-link link-primary
                js-delete-link
                js-delete-link-${matchingProduct.id}"
                  data-product-id="${matchingProduct.id}">Delete</span>
              </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
      `;
    });
    function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach((option) => {
    const today = dayjs();
    const deliveryDate = today.add(option.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = option.priceCents === 0
      ? 'FREE Shipping'
      : `$${formatCurrency(option.priceCents)} - Shipping`;

    const isChecked = option.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${option.id}"> <input type="radio" 
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString}</div>
        </div>
      </div>
    `;
  }); 

  return html;
}
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
    updateCartQuantityHTML();
   
    // ✅ Correção dos Eventos de Teclado
document.querySelectorAll('.quantity-input').forEach((input) => {
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const productId = input.dataset.productId; // Certifique-se de adicionar data-product-id no input se usar assim
      // Ou pegue o ID pela classe se preferir
      const id = input.className.match(/*js-quantity-input-(.*)*/)[1];
      saveQuantity(id);
    }
  });
});
    // ✅ DELETE
    document.querySelectorAll(`.js-delete-link`).forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        if(container){
         container.remove();
         renderOrderSumary();
        renderPaymentSummary(); 
        updateCartQuantityHTML();
        
    }});
    });
    
    function saveQuantity(productId) {
      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
      const newQuantity = Number(quantityInput.value);

      updateCart(productId, newQuantity);

      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
      const cartItem = cart.find((item) => item.productId === productId);
      if (quantityLabel && cartItem) {
        quantityLabel.innerHTML = cartItem.quantity;
      }

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.remove('is-editing-quantity');
      updateCartQuantityHTML();
    }

    // ✅ UPDATE — mostra o input
    document.querySelectorAll('.js-update-link').forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add('is-editing-quantity');

        // ✅ Enter no input
        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
        quantityInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            saveQuantity(productId); // chama a função de salvar
            
          }
        });
      });
    });
    // ✅ SAVE — clique no botão Save
    document.querySelectorAll('.js-save-link').forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        saveQuantity(productId);
          renderOrderSumary();
        renderPaymentSummary(); 
        updateCartQuantityHTML();
      });
    });

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSumary();
        renderPaymentSummary();
      })  
    })
}

