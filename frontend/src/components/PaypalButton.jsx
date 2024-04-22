import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createOrder } from "../features/user/userSlice";
import {
  PayPalButtons,
  usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import Spinner from '../components/Spinner'



// Custom component to wrap the PayPalButtons and handle currency changes
const PaypalButton = ({ currency, amount, showSpinner, tickets, address }) => {

  // usePayPalScriptReducer can be use only inside PayPalScriptProvider
  // This is the main reason to wrap the PayPalButtons in a new component
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner]);


  // Not paypal:
  const reduxDispatch = useDispatch()

  const confirmOrder = () => {
    const ticketsArray = tickets.map(ticket => ({
      item: ticket.item,
      quantity: ticket.quantity,
      ticketType: ticket.ticketType,
      ticketPrice: ticket.ticketPrice,
      seller: ticket.seller
    }))
    const orderDetails = {
      tickets: ticketsArray,
      payment: {
        total: Number(tickets.reduce((a, b) => a + (b.ticketPrice * b.quantity), 0)),
        paymentMethod: 'PayPal',
        billingAddress: address,
        orderedOn: new Date(),
        paid: true,
        paidOn: new Date()
      }
    }
    reduxDispatch(createOrder(orderDetails))
    return
  }

  return (<>
    {(showSpinner && isPending) && <Spinner />}
    <PayPalButtons
      style={{ "layout": "vertical" }}
      disabled={false}
      forceReRender={[currency, amount, showSpinner, tickets, address]}
      fundingSource={undefined}
      createOrder={(data, actions) => {
        return actions.order
          .create({
            purchase_units: [
              {
                amount: {
                  currency_code: currency,
                  value: amount
                },
              },
            ],
          })
          .then((orderId) => {
            return orderId;
          });
      }}
      onApprove={async function (data, actions) {
        const order = await actions.order.capture()
        console.log(order);
        if (order && order.status === 'COMPLETED') {
          console.log('Finished');
          confirmOrder()
          return
        } else {
          console.log('Not yet');
        }
      }}
    />
  </>
  );
}

export default PaypalButton