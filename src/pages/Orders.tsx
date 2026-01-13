import React, { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

type Order = {
  id: string;
  status: "delivered" | "shipped" | "cancelled" | "processing";
  created_at: string;
  total_amount: number;
  shipping_address: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

type OrdersProps = {
  onNavigate: (page: string) => void;
};

export const Orders: React.FC<OrdersProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching orders
    const fetchOrders = async () => {
      try {
        setLoading(true);
        await new Promise((res) => setTimeout(res, 1000)); // simulate network delay

        // mock orders
        const mockOrders: Order[] = [
          {
            id: "abc123",
            status: "shipped",
            created_at: new Date().toISOString(),
            total_amount: 49.99,
            shipping_address: {
              fullName: "John Doe",
              address: "123 Baby St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
            },
          },
          {
            id: "xyz789",
            status: "delivered",
            created_at: new Date().toISOString(),
            total_amount: 29.99,
            shipping_address: {
              fullName: "Jane Smith",
              address: "456 Care Ave",
              city: "Los Angeles",
              state: "CA",
              zipCode: "90001",
            },
          },
        ];

        setOrders(mockOrders);
      } catch {
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "shipped":
        return <Truck className="w-6 h-6 text-blue-500" />;
      case "cancelled":
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-peach-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-peach-100 text-peach-800 dark:bg-peach-900/30 dark:text-peach-400";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-peach-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white animate-fade-in-up">
          My Orders
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <Package className="w-20 h-20 mx-auto mb-6 text-gray-400" />
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              No Orders Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => onNavigate("products")}
              className="px-8 py-4 bg-gradient-to-r from-peach-500 to-peach-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Order #{order.id.toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    <span className="text-2xl font-bold text-peach-600 dark:text-peach-400">
                      ${order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Shipping Address:
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.shipping_address.fullName}
                    <br />
                    {order.shipping_address.address}
                    <br />
                    {order.shipping_address.city},{" "}
                    {order.shipping_address.state}{" "}
                    {order.shipping_address.zipCode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
