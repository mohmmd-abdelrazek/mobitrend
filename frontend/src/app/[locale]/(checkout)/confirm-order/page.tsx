"use client"
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from '@/src/navigation';
import { useCart } from '@/src/services/queries';
import { Cart } from '@/src/types/types';

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
  const { data: cart } = useCart();
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);
  const router = useRouter();


  useEffect(() => {
    const savedShippingDetails = localStorage.getItem('shippingDetails');
    if (savedShippingDetails) {
      setShippingDetails(JSON.parse(savedShippingDetails));
    }
  }, []);

  const handleConfirm = () => {
    router.push('/payment');
  };

  if (!shippingDetails) {
    return <p>Loading...</p>;
  }
const cartItems = cart?.cartItems || []
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Confirm Order</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Shipping Details</h2>
        <p>{shippingDetails.name}</p>
        <p>{shippingDetails.address}</p>
        <p>{shippingDetails.city}, {shippingDetails.postalCode}</p>
        <p>{shippingDetails.country}</p>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Cart Items</h2>
        {cartItems?.map(item => (
          <div key={item.product.toString()} className="mb-2 flex justify-between gap-10">
            <p className="font-medium">{item.name}</p>
            <p>{item.qty} x ${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleConfirm}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default ConfirmOrder;
