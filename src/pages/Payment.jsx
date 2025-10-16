// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useCart } from "../context/CartContext";
// import { useState, useEffect } from "react";
// import axiosInstance from "../api/axiosInstance";

// // ✅ Payment Status Modal
// const PaymentStatusModal = ({ type, message, onClose }) => {
//   useEffect(() => {
//     if (type) {
//       const timer = setTimeout(onClose, 2500);
//       return () => clearTimeout(timer);
//     }
//   }, [type, onClose]);

//   if (!type) return null;

//   const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
//   const text = type === "success" ? "✅ Payment Successful!" : "❌ Payment Failed";

//   return (
//     <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
//       <div className={`${bgColor} text-white rounded-xl p-8 flex flex-col items-center shadow-lg w-96 h-64`}>
//         <h2 className="text-xl font-semibold mb-2">{text}</h2>
//         <p className="text-center">{message}</p>
//       </div>
//     </div>
//   );
// };

// const PaymentPage = () => {
//   const { state } = useLocation(); 
//   const { user } = useAuth();
//   const { clearCart } = useCart();
//   const navigate = useNavigate();
//   const [statusModal, setStatusModal] = useState({ type: null, message: "" });
//   const [loading, setLoading] = useState(false);

//   const { order, razorpayOrderId } = state || {};

//   // Redirect to cart if no order
//   useEffect(() => {
//     if (!order || !razorpayOrderId) navigate("/cart");
//   }, [order, razorpayOrderId, navigate]);

//   const loadRazorpayScript = () =>
//     new Promise((resolve, reject) => {
//       if (window.Razorpay) return resolve(true);
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => reject(false);
//       document.body.appendChild(script);
//     });

//   const handleOnlinePayment = async () => {
//   if (!order) return;

//   setLoading(true);
//   try {
//     await loadRazorpayScript();

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY,
//       amount: order.totalAmount * 100, // amount in paise
//       currency: "INR",
//       name: "DecoraNest",
//       description: "Secure Payment",
//       order_id: razorpayOrderId,
//       handler: async (response) => {
//         try {
//           // ✅ Corrected payload with camelCase
//           const payload = {
//             razorpayOrderId: response.razorpay_order_id,
//             razorpayPaymentId: response.razorpay_payment_id,
//             razorpaySignature: response.razorpay_signature,
//           };
//           console.log("Verifying payment with payload:", payload);

//           await axiosInstance.post("/users/Payment/Verify", payload, {
//             headers: { Authorization: `Bearer ${user?.token}` },
//           });

//           // Payment successful
//           setStatusModal({
//             type: "success",
//             message: "Your payment was successful!",
//           });
//           clearCart();

//           setTimeout(() => {
//             setStatusModal({ type: null, message: "" });
//             navigate("/orders");
//           }, 2500);
//         } catch (err) {
//           console.error(
//             "Payment verification failed:",
//             err.response?.data || err
//           );
//           setStatusModal({
//             type: "error",
//             message: "Payment verification failed!",
//           });
//         }
//       },
//       prefill: { name: user?.name, email: user?.email },
//       theme: { color: "#4CAF50" },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   } catch (err) {
//     console.error("Payment initiation failed:", err);
//     setStatusModal({
//       type: "error",
//       message: "Payment initiation failed.",
//     });
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4">
//       <h2 className="text-2xl font-semibold mb-4">💳 Payment</h2>
//       <p className="mb-4 text-lg">
//         Total Amount: <span className="font-bold">₹{order?.totalAmount.toFixed(2)}</span>
//       </p>

//       <button
//         onClick={handleOnlinePayment}
//         disabled={loading}
//         className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//       >
//         {loading ? "Processing..." : "Pay Online"}
//       </button>

//       <PaymentStatusModal
//         type={statusModal.type}
//         message={statusModal.message}
//         onClose={() => setStatusModal({ type: null, message: "" })}
//       />
//     </div>
//   );
// };

// export default PaymentPage;



import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

// ✅ Payment Status Modal
const PaymentStatusModal = ({ type, message, onClose }) => {
  useEffect(() => {
    if (type) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  if (!type) return null;

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
  const text = type === "success" ? "✅ Payment Successful!" : "❌ Payment Failed";

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
      <div
        className={`${bgColor} text-white rounded-xl p-8 flex flex-col items-center shadow-lg w-96 h-64`}
      >
        <h2 className="text-xl font-semibold mb-2">{text}</h2>
        <p className="text-center">{message}</p>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [statusModal, setStatusModal] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const { order, razorpayOrderId } = state || {};

  // Redirect to cart if order missing
  useEffect(() => {
    if (!order || !razorpayOrderId) navigate("/cart");
  }, [order, razorpayOrderId, navigate]);

  const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });

  const handleOnlinePayment = async () => {
    if (!order) return;

    setLoading(true);
    try {
      await loadRazorpayScript();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.totalAmount * 100, 
        currency: "INR",
        name: "DecoraNest",
        description: "Secure Payment",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
           
            const payload = {
              RazorpayOrderId: response.razorpay_order_id,
              RazorpayPaymentId: response.razorpay_payment_id,
              RazorpaySignature: response.razorpay_signature,
            };

            console.log("Verifying payment with payload:", payload);

            await axiosInstance.post("/users/Payment/Verify", payload, {
              headers: { Authorization: `Bearer ${user?.token}` },
            });

            
            setStatusModal({
              type: "success",
              message: "Your payment was verified successfully!",
            });
            clearCart();

            setTimeout(() => {
              setStatusModal({ type: null, message: "" });
              navigate("/orders");
            }, 2500);
          } catch (err) {
            console.error("Payment verification failed:", err.response?.data || err);
            setStatusModal({
              type: "error",
              message:
                err.response?.data?.message ||
                "Payment verification failed. Please contact support.",
            });
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#4CAF50" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      setStatusModal({
        type: "error",
        message: "Payment initiation failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-semibold mb-4">💳 Payment</h2>
      <p className="mb-4 text-lg">
        Total Amount:{" "}
        <span className="font-bold">₹{order?.totalAmount.toFixed(2)}</span>
      </p>

      <button
        onClick={handleOnlinePayment}
        disabled={loading}
        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Online"}
      </button>

      <PaymentStatusModal
        type={statusModal.type}
        message={statusModal.message}
        onClose={() => setStatusModal({ type: null, message: "" })}
      />
    </div>
  );
};

export default PaymentPage;
