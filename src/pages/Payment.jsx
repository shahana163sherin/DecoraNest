import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";


const PaymentStatusModal = ({ type, message, onClose }) => {
  useEffect(() => {
    if (type) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  if (!type) return null;

  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          className={`${
            isSuccess
              ? "bg-white text-gray-900"
              : "bg-gradient-to-br from-red-500 to-rose-600 text-white"
          } rounded-2xl p-10 flex flex-col items-center justify-center shadow-2xl w-96`}
        >
          {isSuccess ? (
            <img
              src="https://i.pinimg.com/736x/83/6e/67/836e67e00250d67bd1f3f811763327b2.jpg" 
              alt="Success Handshake"
              className="w-32 h-32 mb-4 rounded-xl object-contain"
            />
          ) : (
            <motion.div
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.4 }}
            >
              <XCircle className="w-16 h-16 mb-4 text-white" />
            </motion.div>
          )}

          <h2
            className={`text-2xl font-bold mb-2 ${
              isSuccess ? "text-green-700" : "text-white"
            }`}
          >
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h2>

          <p
            className={`text-center text-sm mb-3 ${
              isSuccess ? "text-gray-700" : "text-white/90"
            }`}
          >
            {message}
          </p>

          {isSuccess && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.4 }}
              className="h-1 bg-green-500/60 rounded-full mt-2"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
        order_id: razorpayOrderId?.razorPayOrderId,
        handler: async (response) => {
          try {
            const payload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
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
            }, 3000);
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
        theme: { color: "#a729acff" },
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">💳 Payment</h2>
        <p className="mb-6 text-lg text-gray-600">
          Total Amount:{" "}
          <span className="font-bold text-gray-900">
            ₹{order?.totalAmount.toFixed(2)}
          </span>
        </p>

        <button
          onClick={handleOnlinePayment}
          disabled={loading}
          className="px-10 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Securely"}
        </button>
      </div>

      <PaymentStatusModal
        type={statusModal.type}
        message={statusModal.message}
        onClose={() => setStatusModal({ type: null, message: "" })}
      />
    </div>
  );
};

export default PaymentPage;
