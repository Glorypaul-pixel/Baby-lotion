// src/pages/admin/ProductsPage.tsx
import React, { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

const mockProducts: Product[] = [
  { id: "1", name: "Product A", price: 50, stock: 10 },
  { id: "2", name: "Product B", price: 75, stock: 5 },
  { id: "3", name: "Product C", price: 120, stock: 0 },
];

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, stock: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add new product
  const handleAdd = () => {
    if (!newProduct.name || newProduct.price < 0 || newProduct.stock < 0) return;

    const productToAdd: Product = {
      id: Date.now().toString(),
      ...newProduct,
    };
    setProducts([...products, productToAdd]);
    setNewProduct({ name: "", price: 0, stock: 0 });
  };

  // Delete product
  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Start editing
  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setNewProduct({ name: product.name, price: product.price, stock: product.stock });
  };

  // Save edit
  const saveEdit = () => {
    setProducts(
      products.map((p) =>
        p.id === editingId ? { ...p, ...newProduct } : p
      )
    );
    setEditingId(null);
    setNewProduct({ name: "", price: 0, stock: 0 });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products Management</h1>

      {/* Add/Edit Form */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: Number(e.target.value) })
          }
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: Number(e.target.value) })
          }
          className="border px-2 py-1 rounded"
        />
        {editingId ? (
          <button
            onClick={saveEdit}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        )}
      </div>

      {/* Products Table */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              className="border-b border-gray-300 dark:border-gray-700"
            >
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">${p.price}</td>
              <td className="px-4 py-2">{p.stock}</td>
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
