import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axiosInstance from '../api/axiosInstance';


const OrderSuccessModal = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
   <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-opacity-30">
  <div className="bg-green-600 text-white rounded-xl p-8 flex flex-col items-center justify-center shadow-lg w-96 h-64">
 
    <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    
    <p className="text-center text-lg font-semibold">{message}</p>
  </div>
</div>

  );
};


const PaymentModal = ({ show, onClose, onSelect }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50  backdrop-blur-sm">
      <div className="bg-blue rounded-xl shadow-lg p-6 w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>
        <div className="space-y-3">
          <button
            onClick={() => onSelect("cod")}
            className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            💵 Cash on Delivery
          </button>
          <button
            onClick={() => onSelect("online")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            💳 Online Payment
          </button>
          <button
            onClick={onClose}
            className="w-full mt-2 border border-gray-400 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate()
  const [message, setMessage] = useState({ text: "", type: "" });
  const [address, setAddress] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
const token=user?.token;
 
  if (!cart || cart.length === 0) {
    return <h2 className="text-center text-xl mt-10">🛒 Your cart is empty</h2>;
  }

  
  const total = cart.reduce(
    (sum, item) =>
      sum +
      (item.unitPrice || item.UnitPrice || item.Product?.price || 0) *
        (item.quantity || item.Quantity),
    0
  );

 
  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 2000);
  };

  
  const handleRemove = async (cartItemId) => {
    try {
      await removeItem(cartItemId);
      showMessage("🗑️ Item removed from cart!", "error");
    } catch (err) {
      console.error(err);
      showMessage("❌ Failed to remove item.", "error");
    }
  };

 
  const handleUpdateQuantity = async (cartItemId, change) => {
    try {
      await updateQuantity(cartItemId, change);
      showMessage("✅ Cart updated!", "success");
    } catch (err) {
      console.error(err);
      showMessage("❌ Failed to update quantity.", "error");
    }
  };


  const handleClearCart = async () => {
    try {
      await clearCart();
      showMessage("🧹 Cart cleared successfully!", "error");
    } catch (err) {
      console.error(err);
      showMessage("❌ Failed to clear cart.", "error");
    }
  };

 
  const messageColors = {
    success: "bg-green-600 text-white border-green-600",
    error: "bg-red-600 text-white border-red-600",
    info: "bg-blue-600 text-white border-blue-600",
  };

 
  const handlePlaceOrderClick = () => {
    if (!address.trim()) {
      showMessage("🏠 Please enter your address!", "info");
      return;
    }
    setShowPaymentModal(true);
  };

const handlePaymentSelect = async (method) => {
  setShowPaymentModal(false);

  if (!cart || cart.length === 0) {
    showMessage("🛒 Your cart is empty, cannot place order.", "error");
    return;
  }

  try {
    console.log("Placing order with token:", token);

    
    const res = await axiosInstance.post(
      "/user/Order/Create",
      { address }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const orderData = res.data?.data;
    console.log(orderData);
    if (!orderData) throw new Error("Order creation failed");

    if (method === "cod") {
        setShowSuccessModal(true);
      
        setTimeout(async () => {
    await clearCart(); 
  }, 1500);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/orders");
      }, 2500);
    } else {
     
      const payRes = await axiosInstance.post(
        "/users/Payment/Pay",
        { orderId: orderData.orderId, amount: orderData.totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpayOrderId } = payRes.data;
      navigate("/payment", { state: { order: orderData, razorpayOrderId } });
    }
  } catch (err) {
    console.error(`${method.toUpperCase()} order failed:`, err);
    showMessage(
      `❌ Failed to place ${method === "cod" ? "COD" : "online"} order.`,
      "error"
    );
  }
};




  return (
    <div className="max-w-3xl mx-auto p-4">
    
      {message.text && (
        <div
          className={`mb-4 p-3 border rounded text-center animate-pulse ${
            messageColors[message.type] || messageColors.info
          }`}
        >
          {message.text}
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">🛒 Your Cart</h2>


      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.cartItemId || item.CartItemId}
            className="p-4 border rounded shadow-sm flex justify-between items-center"
          >
         
            <div className="flex items-center gap-4">
              <img
                src={item.product?.imageUrl || item.Product?.ImageUrl}
                alt={item.product?.name || item.Product?.Name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-medium">
                  {item.product?.name || item.Product?.Name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  ₹
                  {(
                    item.unitPrice ||
                    item.UnitPrice ||
                    item.Product?.Price ||
                    0
                  ).toFixed(2)}
                </p>

           
                <div className="flex gap-2 items-center mt-2">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.cartItemId || item.CartItemId,
                        -1
                      )
                    }
                    disabled={item.quantity <= 1 || item.Quantity <= 1}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ➖
                  </button>
                  <span className="px-2 font-semibold">
                    {item.quantity || item.Quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.cartItemId || item.CartItemId,
                        1
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ➕
                  </button>
                </div>
              </div>
            </div>

           
            <div className="flex flex-col items-end">
              <button
                onClick={() =>
                  handleRemove(item.cartItemId || item.CartItemId)
                }
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

   
      <div className="mt-8 text-right space-y-5">
        <h2 className="text-xl font-bold">Total: ₹{total.toFixed(2)}</h2>

        <input
          type="text"
          placeholder="Enter your address (Place, District, State, Landmark)"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          className="w-full p-3 border border-purple-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
        />

        <button
          onClick={handlePlaceOrderClick}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Place Order
        </button>
      </div>

  
      <PaymentModal
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelect={handlePaymentSelect}
      />

      
      <OrderSuccessModal
        show={showSuccessModal}
        message="✅ Order placed successfully!"
        onClose={() => setShowSuccessModal(false)}
        
      />
    </div>
  );
};

export default Cart;
