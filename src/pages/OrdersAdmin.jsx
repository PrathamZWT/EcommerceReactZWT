import React from "react";

export default function OrdersAdmin() {
  return (
    <div>
      {" "}
      <select
        className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => handleStatusUpdate(order, e.target.value)}
        value={order.status}
      >
        <option value="Pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Canceled">Canceled</option>
      </select>
    </div>
  );
}
