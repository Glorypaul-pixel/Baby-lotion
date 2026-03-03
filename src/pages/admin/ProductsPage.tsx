import React, { useState } from "react";
import { useProducts, type Product } from "../../hooks/useProducts";

export const ProductsPage: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    unit_price: "",
    quantity: 0,
  });

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      unit_price: product.unit_price,
      quantity: product.quantity,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", unit_price: "", quantity: 0 });
  };

  const handleSave = () => {
    console.log("TODO: PATCH /api/products/", editingId, editForm);
    cancelEdit();
  };

  const handleDelete = (id: string) => {
    console.log("TODO: DELETE /api/products/", id);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 py-8 text-center">
        Failed to load products: {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products Management</h1>

      {/* Edit Form */}
      {editingId && (
        <div className="mb-6 flex flex-wrap gap-2 items-center bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <input
            type="text"
            placeholder="Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="Price"
            value={editForm.unit_price}
            onChange={(e) =>
              setEditForm({ ...editForm, unit_price: e.target.value })
            }
            className="border px-2 py-1 rounded w-28"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={editForm.quantity}
            onChange={(e) =>
              setEditForm({ ...editForm, quantity: Number(e.target.value) })
            }
            className="border px-2 py-1 rounded w-24"
          />
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={cancelEdit}
            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Products Table */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Tag</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              className="border-b border-gray-300 dark:border-gray-700"
            >
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2 capitalize">{p.tag}</td>
              <td className="px-4 py-2">
                ₦{parseFloat(p.unit_price).toFixed(2)}
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => startEdit(p)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
