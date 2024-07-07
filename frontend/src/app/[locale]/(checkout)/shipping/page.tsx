"use client";
import { useState } from "react";
import { useRouter } from "@/src/navigation";

const ShippingInfo = () => {
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails({ ...shippingDetails, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("shippingDetails", JSON.stringify(shippingDetails));
    router.push("/confirm-order");
  };

  return (
      <div className="w-full max-w-md bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Shipping Information</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={shippingDetails.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          />
          <input
            name="address"
            placeholder="Address"
            value={shippingDetails.address}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          />
          <input
            name="city"
            placeholder="City"
            value={shippingDetails.city}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          />
          <input
            name="postalCode"
            placeholder="Postal Code"
            value={shippingDetails.postalCode}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          />
          <input
            name="country"
            placeholder="Country"
            value={shippingDetails.country}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
          >
            Continue to Confirm Order
          </button>
        </form>
      </div>
  );
};

export default ShippingInfo;
