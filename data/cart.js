import { deliveryOptions } from "./deliveryOptions.js";
export let cart;
 loadFromStorage();
// ✅ FIX: salva o carrinho padrão no localStorage imediatamente

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart) {
    cart = [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    }, {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }];
  }
}

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ✅ FIX 1: Calcula a quantidade total direto do array `cart`
export function getTotalQuantity() {
  let total = 0;
  cart.forEach((cartItem) => {
    total += cartItem.quantity;
  });
  return total;
}
const quantyDisplay = document.querySelector('.cart-quantity');

if (quantyDisplay != null) {
  quantyDisplay.innerHTML = getTotalQuantity();
}
         
export const addtocart = () => {
  const addedMessageTimeouts = {};
  const allButtons = document.querySelectorAll('.js-add-to-cart');

  allButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;

      // Mensagem de "Adicionado"
      const addedMensage = document.querySelector(
        `.js-added-to-cart-message-${productId}`
      );
      addedMensage.style.opacity = '1';

      if (addedMessageTimeouts[productId]) {
        clearTimeout(addedMessageTimeouts[productId]);
      }
      const timeoutId = setTimeout(() => {
        addedMensage.style.opacity = '0';
      }, 2000);
      addedMessageTimeouts[productId] = timeoutId;

      // Pega a quantidade selecionada no select
     // No cart.js, mude a linha do selectedQuantity para:
    const select = document.querySelector(`.js-quantity-selector-${productId}`);
    const selectedQuantity = select ? Number(select.value) : 1;

      // Procura se o produto já está no carrinho
      let matchingItem;
      cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
          matchingItem = cartItem;
        }
      });

      if (matchingItem) {
        // ✅ FIX 3: Soma a quantidade selecionada (não apenas +1)
        matchingItem.quantity += selectedQuantity;
      } else {
        // ✅ FIX 4: Usa `selectedQuantity` (número) em vez do elemento DOM
        cart.push({
          productId: productId,
          quantity: selectedQuantity,
          deliveryOptionId: '1'
        });
      }

      saveToStorage();

      // ✅ FIX 5: Atualiza o display somando todos os itens do carrinho
     quantyDisplay.innerHTML = getTotalQuantity();

      console.log('Conteúdo do carrinho agora:', cart);
    });
  });
};
    export function updateCart(productId, newQuantity) {
      const matchingItem = cart.find((item) => item.productId === productId);

      if (matchingItem) {
        
        matchingItem.quantity = newQuantity ; // substitui, não soma
      }

      saveToStorage();
    }

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
    // ✅ FIX 6: Removido `cartItem.remove()` — objetos JS não têm esse método
    // A remoção do elemento HTML deve ser feita em quem chama essa função
  });

  cart = newCart;

saveToStorage()
getTotalQuantity()
}
export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingItem;

  cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });

      matchingItem.deliveryOptionId = deliveryOptionId;

      saveToStorage();
}


export function loadCart(fun){
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
   console.log(xhr.response)

   fun();  
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();

}