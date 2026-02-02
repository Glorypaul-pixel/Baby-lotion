// src/pages/admin/OrdersPage.tsx
import React from "react";

const mockOrders = [
  { id: "1", user: "John", total: 120, status: "Pending" },
  { id: "2", user: "Mary", total: 75, status: "Completed" },
];

export const OrdersPage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-800">
          <th className="px-4 py-2">Order ID</th>
          <th className="px-4 py-2">User</th>
          <th className="px-4 py-2">Total</th>
          <th className="px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {mockOrders.map((o) => (
          <tr key={o.id} className="border-b border-gray-300 dark:border-gray-700">
            <td className="px-4 py-2">{o.id}</td>
            <td className="px-4 py-2">{o.user}</td>
            <td className="px-4 py-2">${o.total}</td>
            <td className="px-4 py-2">{o.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
