"use client"
import { useEffect, useState } from 'react';
import { useRouter } from '@/src/navigation';

// Define types for shipping details and cart items
type ShippingDetails = {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type CartItem = {
  product: string;
  name: string;
  qty: number;
  price: number;
};

const ConfirmOrder = () => {
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedShippingDetails = localStorage.getItem('shippingDetails');
    if (savedShippingDetails) {
      setShippingDetails(JSON.parse(savedShippingDetails));
    }

    // Load cart items from local storage or context
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  const handleConfirm = () => {
    router.push('/payment');
  };

  if (!shippingDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Confirm Order</h1>
      <div>
        <h2>Shipping Details</h2>
        <p>{shippingDetails.name}</p>
        <p>{shippingDetails.address}</p>
        <p>{shippingDetails.city}, {shippingDetails.postalCode}</p>
        <p>{shippingDetails.country}</p>
      </div>
      <div>
        <h2>Cart Items</h2>
        {cartItems.map(item => (
          <div key={item.product}>
            <p>{item.name}</p>
            <p>{item.qty} x ${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <button onClick={handleConfirm}>Continue to Payment</button>
    </div>
  );
};

export default ConfirmOrder;
