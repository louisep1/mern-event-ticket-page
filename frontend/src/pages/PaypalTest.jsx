// // https://paypal.github.io/react-paypal-js/?path=/docs/example-paypalbuttons--default
// // https://www.npmjs.com/package/@paypal/react-paypal-js
// // sb-kllqy16741849@personal.example.com
// // eP.qq6.B


// import { useEffect } from "react";
// import {
//   PayPalScriptProvider,
//   PayPalButtons,
//   usePayPalScriptReducer
// } from "@paypal/react-paypal-js";

// // This values are the props in the UI
// const amount = "2";
// const currency = "GBP";
// const style = { "layout": "vertical" };

// // Custom component to wrap the PayPalButtons and handle currency changes
// const ButtonWrapper = ({ currency, showSpinner }) => {
//   // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
//   // This is the main reason to wrap the PayPalButtons in a new component
//   const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

//   useEffect(() => {
//     dispatch({
//       type: "resetOptions",
//       value: {
//         ...options,
//         currency: currency,
//       },
//     });
//   }, [currency, showSpinner]);


//   return (<>
//     {(showSpinner && isPending) && <div className="spinner" />}
//     <PayPalButtons
//       style={style}
//       disabled={false}
//       forceReRender={[amount, currency, style]}
//       fundingSource={undefined}
//       createOrder={(data, actions) => {
//         return actions.order
//           .create({
//             purchase_units: [
//               {
//                 amount: {
//                   currency_code: currency,
//                   value: amount,
//                 },
//               },
//             ],
//           })
//           .then((orderId) => {
//             // Your code here after create the order
//             return orderId;
//           });
//       }}
//       onApprove={function (data, actions) {
//         return actions.order.capture().then(function () {
//           // Your code here after capture the order
//           console.log(actions.order.capture())
//         });
//       }}
//     />
//   </>
//   );
// }

// export default function PayPalTest() {
//   return (
//     <div style={{ maxWidth: "750px", minHeight: "200px" }}>
//       <PayPalScriptProvider
//         options={{
//           "client-id": "AeJLdRk9DQfxOnwvQYgwz_Zno2V_j9oIPPGFZ8tDkCzqwIhnrKPxE9yN2IuONk0nvfivlC45_8NGUwrn",
//           components: "buttons",
//           currency: "GBP"
//         }}
//       >
//         <ButtonWrapper
//           currency={currency}
//           showSpinner={false}
//         />
//       </PayPalScriptProvider>
//     </div>
//   );
// }