import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Cart, CartItem, Product } from "../types/types";

// Database schema and setup
interface CartRecord {
  key: string;
  value: Cart;
}

interface CartDB extends DBSchema {
  cart: {
    key: string;
    value: CartRecord;
  };
}

const isBrowser = typeof window !== "undefined";

let db: IDBPDatabase<CartDB> | null = null;

export const getDb = async (): Promise<IDBPDatabase<CartDB>> => {
  if (!isBrowser) {
    throw new Error("IndexedDB is not available");
  }

  if (!db) {
    db = await openDB<CartDB>("cart-database", 1, {
      upgrade(db) {
        db.createObjectStore("cart", { keyPath: "key" });
      },
    });
  }

  return db;
};

// Utility functions
export const TAX_RATE = 0.1;
export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING_COST = 10;

export const calculateTax = (amount: number) => amount * TAX_RATE;
export const calculateShipping = (amount: number) =>
  amount > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

export const findCartItemIndex = (
  cartItems: CartItem[],
  productId: string | string[],
): number => {
  return cartItems.findIndex((item) => item.product === productId);
};

export const getProductById = async (
  productId: string | string[],
  products: Product[],
): Promise<Product | null> => {
  const product = products.find((product: Product) => product._id.toString() === productId);
  return product || null;
};

export const updateCartTotals = (cart: Cart): void => {
  cart.itemsPrice = cart.cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );
  cart.taxPrice = calculateTax(cart.itemsPrice);
  cart.shippingPrice = calculateShipping(cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.taxPrice + cart.shippingPrice;
};

// Cart operations
export const addItemToLocalCart = async (
  productId: string | string[],
  qty: number,
  products: Product[],
): Promise<Cart | null> => {
  if (!isBrowser) return null;
  const db = await getDb();

  let cartRecord = await db.get("cart", "userCart");

  if (!cartRecord) {
    const newCart: Cart = {
      cartItems: [],
      paymentMethod: "",
      itemsPrice: 0,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: 0,
    };
    await db.put("cart", { key: "userCart", value: newCart });
    cartRecord = { key: "userCart", value: newCart };
  }

  const cart = cartRecord.value;
  const product = await getProductById(productId, products);
  if (!product) throw new Error("Product not found");

  const itemIndex = findCartItemIndex(cart.cartItems, productId);
  const image = product.images.length > 0
    ? product.images[0]
    : "https://res.cloudinary.com/dhliba9i5/image/upload/v1714169979/products/default-placeholder_r9thjf.png";

  if (itemIndex > -1) {
    cart.cartItems[itemIndex].qty += qty;
  } else {
    const newItem: CartItem = {
      product: product._id.toString(),
      name: product.name,
      image: image,
      price: product.price,
      countInStock: product.inStock,
      qty,
    };
    cart.cartItems.push(newItem);
  }

  updateCartTotals(cart);
  await db.put("cart", { key: "userCart", value: cart });

  return cart;
};

export const removeItemFromLocalCart = async (
  productId: string,
): Promise<Cart | null> => {
  if (!isBrowser) return null;
  const db = await getDb();
  const cartRecord = await db.get("cart", "userCart");

  if (!cartRecord) throw new Error("Cart not found");

  const cart = cartRecord.value;
  const itemIndex = findCartItemIndex(cart.cartItems, productId);
  if (itemIndex > -1) {
    cart.cartItems.splice(itemIndex, 1);
    updateCartTotals(cart);
    await db.put("cart", { key: "userCart", value: cart });
  }

  return cart;
};

export const updateItemInLocalCart = async (
  productId: string,
  qty: number,
): Promise<Cart | null> => {
  if (!isBrowser) return null;
  const db = await getDb();

  try {
    const cartRecord = await db.get("cart", "userCart");
    if (!cartRecord) throw new Error("Cart not found");

    const cart = cartRecord.value;
    const itemIndex = findCartItemIndex(cart.cartItems, productId);
    if (itemIndex > -1) {
      cart.cartItems[itemIndex].qty = qty;
      updateCartTotals(cart);
      await db.put("cart", { key: "userCart", value: cart });
    } else {
      throw new Error("Product not found in cart");
    }

    return cart;
  } catch (error) {
    console.error("Error updating item in cart:", error);
    return null;
  }
};

export const clearLocalCart = async (): Promise<void> => {
  if (!isBrowser) return;
  const db = await getDb();
  await db.delete("cart", "userCart");
};

export const getLocalCart = async (): Promise<Cart | null> => {
  if (!isBrowser) return null;
  const db = await getDb();
  const cartRecord = await db.get("cart", "userCart");

  if (!cartRecord) {
    return {
      cartItems: [],
      paymentMethod: "",
      itemsPrice: 0,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: 0,
    };
  }

  return cartRecord.value;
};
