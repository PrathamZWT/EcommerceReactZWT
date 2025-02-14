import { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function OrderHistory() {
  const [orders, setOrderData] = useState([]);
  const [role, setRole] = useState();
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  useEffect(() => {
    async function fetchOrderData() {
      if (!role) return;

      try {
        const token = localStorage.getItem("token");
        const url =
          role === "admin"
            ? `${import.meta.env.VITE_ORDERS_API}/admin`
            : `${import.meta.env.VITE_ORDERS_API}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch order data");
        const jsonData = await response.json();
        setOrderData(jsonData.orderhistory);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }

    fetchOrderData();
  }, [role]);

  async function handleStatusUpdate(id, value) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_ORDERS_API}/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: value }),
        }
      );
      const jsonData = await response.json();
      if (!response.ok) {
        alert(jsonData.message);
        throw new Error("Failed to update order status");
      }
      setOrderData(jsonData.orderhistory);
      window.location.reload();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.id}</h3>
          <p className="text-gray-600">{order.createdAt}</p>
        </div>
        {role === "admin" && (
          <div className="flex items-center space-x-4">
            <select
              className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
            >
              <option value="Pending" selected disabled>
                {order.status}
              </option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
              statusStyles[order.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {order.status}
          </span>

          <span className="font-semibold">₹{order.total_price}</span>
        </div>
      </div>

      <div className="space-y-4">
        {order.Order_Items.map((product) => (
          <div
            key={product.product_id}
            className="flex flex-col md:flex-row items-center p-4 bg-gray-50 rounded-lg"
          >
            <Link to={`/productDetails/${product.product_id}`}>
              <img
                src={`${import.meta.env.VITE_IMAGE}/${
                  product.Product.image_url
                }`}
                alt={product.Product.name}
                className="w-20 h-20 object-cover rounded-lg mb-4 md:mb-0 md:mr-4"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
                }}
              />
            </Link>
            <div className="flex-grow">
              <h4 className="font-medium">{product.Product.name}</h4>
              <div className="flex flex-col md:flex-row md:justify-between mt-2">
                <p className="text-gray-600">Quantity: {product.quantity}</p>
                <p className="text-gray-600">Price: ₹{product.Product.price}</p>
                <p className="font-medium">
                  Subtotal: ₹{product.quantity * product.Product.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  console.log(orders);
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {role === "admin" ? (
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Orders</h1>
          ) : (
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Order History</h1>
          )}
          <div className="flex space-x-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
            <button className="flex items-center px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50">
              <FaFilter className="mr-2" />
              Filter
              <FaChevronDown className="ml-2" />
            </button>
          </div>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
