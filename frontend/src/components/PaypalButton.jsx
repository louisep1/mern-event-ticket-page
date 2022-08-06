import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createOrder } from "../features/user/userSlice";
import {
  PayPalButtons,
  usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import Spinner from '../components/Spinner'



// Custom component to wrap the PayPalButtons and handle currency changes
const PaypalButton = ({ currency, amount, showSpinner, tickets, address }) => {

  // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
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
      // forceReRender={[amount, currency, style]}
      forceReRender={[currency, amount, showSpinner, tickets, address]}
      fundingSource={undefined}
      createOrder={(data, actions) => {
        return actions.order
          .create({
            purchase_units: [
              {
                amount: {
                  currency_code: currency,
                  // value: '2',
                  value: amount
                },
              },
            ],
          })
          .then((orderId) => {
            // Your code here after create the order
            return orderId;
          });
      }}
      onApprove={async function (data, actions) {
        const order = await actions.order.capture()
        // Your code here after capture the order
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



// import { useState } from 'react'
// import { PayPalButtons } from "@paypal/react-paypal-js"

// const PaypalButton = (props) => {
//   const { product } = props

//   const [paidFor, setPaidFor] = useState(false)
//   const [error, setError] = useState(null)


//   const handleApprove = (orderId) => {
//     // call backend function to fulfill order

//     // if response is success
//     setPaidFor(true)

//     // refresh user's account or subscription status

//     // if the response returns error
//     // setError('Your purchase could not be made.')
//   }

//   if (paidFor) {
//     // Display success message, or redirect user to success page
//     alert('Thank you for your purchase')
//   }

//   if (error) {
//     // Display error message, modal or redirect user to error page
//     alert(error)
//   }

//   return (
//     <PayPalButtons
//       onClick={(data, actions) => {
//         // Validate on button click or server side
//         const hasAlreadyBought = false

//         if (hasAlreadyBought) {
//           setError('You already bought this item. Go to your account to view.')

//           return actions.reject()
//         } else {
//           return actions.resolve()
//         }
//       }}

//       createOrder={(data, actions) => {
//         return actions.order.create({
//           purchase_units: [
//             {
//               description: product.description,
//               amount: {
//                 value: product.price
//               }
//             }
//           ]
//         })
//       }}

//       onApprove={async (data, actions) => {
//         const order = await actions.order.capture
//         console.log(order)

//         handleApprove(data.orderID)
//       }}

//       onCancel={() => {
//         // display cancel message, modal or redirect the user to the cancel page or back to cart

//       }}

//       onError={(err) => {
//         setError(err)
//         console.error("PaPal Checkout onError", err)
//       }}
//     />
//   )
// }



export default PaypalButton