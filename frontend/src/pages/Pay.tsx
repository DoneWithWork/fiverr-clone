import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "@/components/CheckOutForm";
import { FetchHelper } from "@/lib/fetchHelper";
import { useParams } from "react-router-dom";
import "../components/Payment.css";
// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  "pk_test_51PhU4DBFAdX7AvHeMReBVgVWBJhNm8D9KtPRxlOPZUkJvXwEPmxEnXZrxp8Rkd8VFbp3nIrl59wYE7ZL5RAa7LUf00H6b3hZVA"
);

export default function Pay() {
  const [clientSecret, setClientSecret] = useState("");
  // const [dpmCheckerLink, setDpmCheckerLink] = useState("");
  const { id } = useParams();
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const data = await FetchHelper(
        `orders/create-payment-intent/${id}`,
        "POST"
      );
      if (!data) {
        return;
      }
      setClientSecret(data.client_secret);
    };
    fetchPaymentIntent();
  }, [id]);

  const appearance = {
    theme: "stripe" as const,
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
