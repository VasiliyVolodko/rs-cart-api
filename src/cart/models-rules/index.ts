import { Product } from "../models";
import { Cart, CartItem } from "../services/cart.entities";

/**
 * @param {Cart} cart
 * @returns {number}
 */
export async function calculateCartTotal(cart: Cart): Promise<number> {
  return cart ? await cart.items.reduce(async (acc: Promise<number> | number, item: CartItem) => {
    let acualAcc = await acc
    const responce: Response = await fetch(`https://n7n8t60kf0.execute-api.eu-west-1.amazonaws.com/dev/products/${item.product_id}`)
    const productInfo: Product = await responce.json()
    return acualAcc += productInfo.price * item.count;
  }, 0) : 0;
}
