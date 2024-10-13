import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckOutForm from './CheckOutForm';

const PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CheckOutForm />
    </Elements>
  );
};
export default StripeContainer;
