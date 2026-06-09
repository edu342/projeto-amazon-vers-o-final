import { cart, loadFromStorage } from "../../data/cart.js";
import { addToCart } from "../../data/cart2.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
describe('test suite: addToCart', () => {
  it('adds an existing product to the cart', () => {
     spyOn(localStorage, 'setItem');

     spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    })
    loadFromStorage();

    addToCart('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(cart.length).toEqual(1); 
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(cart[0].quantity).toEqual(1)
  });

  it('add a new product to the cart', () => {
    // 1. Mock do localStorage
    
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    })
    loadFromStorage();

    addToCart('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(cart.length).toEqual(1); 
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(cart[0].quantity).toEqual(1)
  });
});