import { useState, useEffect } from 'react';
import { mutate } from 'swr';

interface QuantitySelectorProps {
  maxQty?: number;
  onQuantityChange: (newQty: number) => void;
  quantity: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  maxQty = 99, // Assume a default max quantity if not provided
  onQuantityChange,
  quantity,
}) => {

  const handleIncrement = () => {
    if (quantity < maxQty) {
      const newQty = quantity + 1;
      onQuantityChange(newQty);
      mutate("/cart");
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      onQuantityChange(newQty);
      mutate("/cart");
    }
  };

  return (
    <div className="flex items-center text-xs font-md">
      <button
        onClick={handleDecrement}
        disabled={quantity < 1}
        className="text-white bg-red-500 px-2 py-1 hover:bg-red-600 rounded disabled:bg-red-300"
      >
        -
      </button>
      <span className="mx-2">{quantity}</span>
      <button
        onClick={handleIncrement}
        disabled={quantity >= maxQty}
        className="text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded disabled:bg-blue-300"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;