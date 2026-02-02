// src/pages/admin/UsersPage.tsx
import React from "react";

const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "user" },
  { id: "2", name: "Admin User", email: "admin@example.com", role: "admin" },
];

export const UsersPage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Users Management</h1>
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-800">
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Role</th>
        </tr>
      </thead>
      <tbody>
        {mockUsers.map((u) => (
          <tr key={u.id} className="border-b border-gray-300 dark:border-gray-700">
            <td className="px-4 py-2">{u.name}</td>
            <td className="px-4 py-2">{u.email}</td>
            <td className="px-4 py-2">{u.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
