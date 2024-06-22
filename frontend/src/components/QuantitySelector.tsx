import { useState, useEffect, useCallback } from "react";
// import { mutate } from "swr";
import LoadingIndicator from "./LoadingIndicator";

interface QuantitySelectorProps {
  maxQty?: number;
  minQty?: number;
  onQuantityChange: (newQty: number) => void;
  quantity: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  maxQty = 99,
  minQty = 1,
  onQuantityChange,
  quantity,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [internalQuantity, setInternalQuantity] = useState(quantity);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInternalQuantity(quantity);
  }, [quantity]);

  const handleQuantityChange = (newQty: number) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    setInternalQuantity(newQty);
    setDebounceTimer(setTimeout(async() => {
      setIsUpdating(true);
      onQuantityChange(newQty);
      // await mutate("/cart");
      setIsUpdating(false);
    }, 500));
  };

  const handleIncrement = () => {
    if (internalQuantity < maxQty) {
      handleQuantityChange(internalQuantity + 1);
    }
  };

  const handleDecrement = () => {
    if (internalQuantity > 0) {
      handleQuantityChange(internalQuantity - 1);
    }
  };

  return (
    <div className="font-md flex items-center text-xs">
      <button
        onClick={handleDecrement}
        disabled={internalQuantity <= minQty}
        className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600 disabled:bg-red-300"
      >
        -
      </button>
      {isUpdating ? <LoadingIndicator w={6} d={4} /> : <span className="w-6 text-center">{internalQuantity}</span>}
      <button
        onClick={handleIncrement}
        disabled={internalQuantity >= maxQty}
        className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600 disabled:bg-blue-300"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
