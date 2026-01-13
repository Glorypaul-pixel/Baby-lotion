import React, { useEffect, useState } from "react";
import { Star, Filter, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";

export type Product = {
  id: string;
  name: string;
  description: string;
  category: "soap" | "baby_lotion" | "adult_lotion";
  price: number;
  image_url: string;
  stock: number;
  is_featured: boolean;
  created_at: string;
};

type ProductsProps = {
  onNavigate: (page: string) => void;
};

export const Products: React.FC<ProductsProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // mock auth
  const user = { id: "mock-user" };

  const addToCart = (id: string) =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        console.log(`Product ${id} added to cart for user ${user.id}`);
        resolve();
      }, 500)
    );

  const categories = [
    { id: "all", name: "All Products" },
    { id: "soap", name: "Baby Soap" },
    { id: "baby_lotion", name: "Baby Lotion" },
    { id: "adult_lotion", name: "Adult Lotion" },
  ];

  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Gentle Baby Soap",
        description: "Mild and natural soap for delicate skin.",
        price: 5.99,
        stock: 8,
        category: "soap",
        image_url: "/images/pink.png",
        is_featured: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Baby Lotion",
        description: "Keeps your baby's skin soft and smooth.",
        price: 9.99,
        stock: 0,
        category: "baby_lotion",
        image_url: "/images/green.png",
        is_featured: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Adult Lotion",
        description: "Gentle moisturizing lotion suitable for adults.",
        price: 12.5,
        stock: 15,
        category: "adult_lotion",
        image_url: "/images/orange.png",
        is_featured: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "4",
        name: "Baby Lotion",
        description: "Keeps your baby's skin soft and smooth.",
        price: 9.99,
        stock: 0,
        category: "baby_lotion",
        image_url: "/images/green.png",
        is_featured: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "5",
        name: "Adult Lotion",
        description: "Gentle moisturizing lotion suitable for adults.",
        price: 12.5,
        stock: 15,
        category: "adult_lotion",
        image_url: "/images/orange.png",
        is_featured: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "6",
        name: "Adult Lotion",
        description: "Gentle moisturizing lotion suitable for adults.",
        price: 12.5,
        stock: 15,
        category: "adult_lotion",
        image_url: "/images/orange.png",
        is_featured: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "7",
        name: "Adult Lotion",
        description: "Gentle moisturizing lotion suitable for adults.",
        price: 12.5,
        stock: 15,
        category: "adult_lotion",
        image_url: "/images/orange.png",
        is_featured: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "8",
        name: "Adult Lotion",
        description: "Gentle moisturizing lotion suitable for adults.",
        price: 12.5,
        stock: 15,
        category: "adult_lotion",
        image_url: "/images/orange.png",
        is_featured: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "9",
        name: "Gentle Baby Soap",
        description: "Mild and natural soap for delicate skin.",
        price: 5.99,
        stock: 8,
        category: "soap",
        image_url: "/images/pink.png",
        is_featured: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "10",
        name: "Baby Lotion",
        description: "Keeps your baby's skin soft and smooth.",
        price: 9.99,
        stock: 0,
        category: "baby_lotion",
        image_url: "/images/green.png",
        is_featured: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "11",
        name: "Gentle Baby Soap",
        description: "Mild and natural soap for delicate skin.",
        price: 5.99,
        stock: 8,
        category: "soap",
        image_url: "/images/pink.png",
        is_featured: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "12",
        name: "Baby Lotion",
        description: "Keeps your baby's skin soft and smooth.",
        price: 9.99,
        stock: 0,
        category: "baby_lotion",
        image_url: "/images/green.png",
        is_featured: true,
        created_at: new Date().toISOString(),
      },
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    setFilteredProducts(
      selectedCategory === "all"
        ? products
        : products.filter((p) => p.category === selectedCategory)
    );
  }, [selectedCategory, products]);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast.error("Please sign in to add items to cart.");
      onNavigate("auth");
      return;
    }

    try {
      await addToCart(productId);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart.");
    }
  };

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
          {categories.map((category) => (
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

        {/* Products */}
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
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    {product.stock === 0 && (
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
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.stock} in stock
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0}
                      className="w-full py-3 bg-gradient-to-r from-peach-500 to-peach-600 text-white rounded-full flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
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
