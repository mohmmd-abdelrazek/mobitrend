"use client";
import { SWRConfig } from "swr";
import fetcher from "@/src/services/fetcher";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
}

import React, { useState, useContext, useEffect } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const StripeContext = React.createContext<Stripe | null>(null);

export const useStripe = () => useContext(StripeContext);

export const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    loadStripe(
      "pk_test_51PNfK007DRS2e9ECEw8OjmPXhkZkTynaSdX7VkBpBBuqlxetzy2ephGKh3xLCcwoAd2WC10oQkP5vMHr5LHO3M9n00tjP4zoDA",
    ).then(setStripe);
  }, []);

  if (!stripe) return null;

  return (
    <StripeContext.Provider value={stripe}>
      <Elements stripe={stripe}>{children}</Elements>
    </StripeContext.Provider>
  );
};
