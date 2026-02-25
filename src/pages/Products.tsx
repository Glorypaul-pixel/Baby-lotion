import React, { useEffect, useState } from "react";
import { Star, Filter, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useProducts, type Product } from "../hooks/useProducts";

type ProductsProps = {
  onNavigate: (page: string) => void;
};

const CATEGORIES = [
  { id: "all", name: "All Products" },
  { id: "baby soap", name: "Baby Soap" },
  { id: "baby_lotion", name: "Baby Lotion" },
  { id: "adult_lotion", name: "Adult Lotion" },
];

export const Products: React.FC<ProductsProps> = ({ onNavigate }) => {
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // mock auth — replace with useAuth() once CORS is fixed
  const user = { id: "mock-user" };

  useEffect(() => {
    setFilteredProducts(
      selectedCategory === "all"
        ? products
        : products.filter((p) => p.tag === selectedCategory)
    );
  }, [selectedCategory, products]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to cart.");
      onNavigate("auth");
      return;
    }
    // TODO: wire up real cart endpoint
    toast.success("Added to cart!");
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load products: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-peach-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-peach-500 to-peach-600 bg-clip-text text-transparent">
            Our Products
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Premium baby care products for gentle, loving care
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center justify-center mb-8 gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-peach-500 to-peach-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
                />
              ))
            : filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative h-64 bg-peach-100 dark:bg-gray-700">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.quantity === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-peach-400 text-peach-400"
                        />
                      ))}
                      <span className="ml-2 text-sm">(50+)</span>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-peach-600">
                        ${parseFloat(product.unit_price).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.quantity} in stock
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart()}
                      disabled={product.quantity === 0}
                      className="w-full py-3 bg-gradient-to-r from-peach-500 to-peach-600 text-white rounded-full flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <p className="text-center py-20 text-xl">
            No products found in this category
          </p>
        )}
      </div>
    </div>
  );
};