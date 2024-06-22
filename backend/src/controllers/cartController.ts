import { Request, Response } from "express";
import CartModel, { ICartItem } from "../models/CartModel";
import ProductModel from "../models/ProductModel"; // Assuming this is your Product Model

// Helper function to find a cart item
const findCartItemIndex = (cartItems: ICartItem[], productId: string) => {
  return cartItems.findIndex((item) => item.product.toString() === productId);
};

// Add item to cart
export const addItemToCart = async (req: Request, res: Response) => {
  const { productId, qty } = req.body;
  const userId = req.user?._id;

  try {
    const cart =
      (await CartModel.findOne({ user: userId })) ||
      new CartModel({ user: userId });
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const itemIndex = findCartItemIndex(cart.cartItems, productId);
    const image =
      product.images.length > 0
        ? product.images[0]
        : "https://res.cloudinary.com/dhliba9i5/image/upload/v1714169979/products/default-placeholder_r9thjf.png";

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].qty += qty;
    } else {
      cart.cartItems.push({
        product: product._id,
        name: product.name,
        image: image,
        price: product.price,
        countInStock: product.inStock,
        qty,
      });
    }
    cart.calculateTotal();
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cart", error });
    console.log("error", error);
  }
};

// Remove item from cart
export const removeItemFromCart = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = req.user?._id;

  try {
    const cart = await CartModel.findOne({ user: userId });
    if (cart) {
      const itemIndex = findCartItemIndex(cart.cartItems, productId);
      if (itemIndex > -1) {
        cart.cartItems.splice(itemIndex, 1);
        cart.calculateTotal();
        await cart.save();
      }
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart", error });
  }
};

// Update item quantity in cart
export const updateItemInCart = async (req: Request, res: Response) => {
  const { productId, qty } = req.body;
  const userId = req.user?._id;

  try {
    const cart = await CartModel.findOne({ user: userId });
    if (cart) {
      const itemIndex = findCartItemIndex(cart.cartItems, productId);
      if (itemIndex > -1) {
        cart.cartItems[itemIndex].qty = qty;
        cart.calculateTotal();
        await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: "Item not found in cart" });
      }
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating item in cart", error });
  }
};

// Get cart for user
export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  try {
    const cart = await CartModel.findOne({ user: userId });
    if (cart) {
      res.json(cart);
    } else {
      const cart =
        (await CartModel.findOne({ user: userId })) ||
        new CartModel({ user: userId });

      cart.calculateTotal();
      await cart.save();
      res.status(201).json(cart);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

// Clear all items from the cart
export const clearCart = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  try {
    const cart = await CartModel.findOne({ user: userId });
    if (cart) {
      cart.cartItems = [];
      cart.itemsPrice = 0;
      cart.taxPrice = 0;
      cart.shippingPrice = 0;
      cart.totalPrice = 0;
      await cart.save();
      res.status(200).json({ message: "Cart cleared successfully", cart });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};

const mergeCartItems = (
  userCartItems: ICartItem[],
  localCartItems: ICartItem[]
): ICartItem[] => {
  localCartItems.forEach((localItem) => {
    const userCartItemIndex = findCartItemIndex(
      userCartItems,
      localItem.product.toString()
    );
    if (userCartItemIndex > -1) {
      userCartItems[userCartItemIndex].qty += localItem.qty;
    } else {
      userCartItems.push(localItem);
    }
  });
  return userCartItems;
};

export const mergeCarts = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const localCart = req.body.localCart;

  try {
    const userCart = await CartModel.findOne({ user: userId });

    if (localCart && userCart) {
      userCart.cartItems = mergeCartItems(
        userCart.cartItems,
        localCart.cartItems
      );
      userCart.calculateTotal();
      await userCart.save();

      res
        .status(200)
        .json({ message: "Carts merged successfully", cart: userCart });
    } else {
      res.status(404).json({ message: "No carts to merge" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error merging carts", error });
  }
};
