import React from "react";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Activity,
} from "lucide-react";

type Stat = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
};

export const DashboardPage: React.FC = () => {
  const stats: Stat[] = [
    {
      title: "Total Products",
      value: 120,
      icon: <Package className="w-6 h-6 text-blue-600" />,
      change: "+8 this month",
    },
    {
      title: "Total Orders",
      value: 75,
      icon: <ShoppingCart className="w-6 h-6 text-green-600" />,
      change: "+12 this week",
    },
    {
      title: "Registered Users",
      value: 40,
      icon: <Users className="w-6 h-6 text-purple-600" />,
      change: "+5 new",
    },
    {
      title: "Revenue",
      value: "$12,500",
      icon: <DollarSign className="w-6 h-6 text-orange-600" />,
      change: "+18%",
    },
  ];

  const recentActivities = [
    "New product added: Baby Lotion",
    "Order #1023 completed",
    "New user registered",
    "Blog post published",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Overview of platform activity and performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                {stat.icon}
              </div>
            </div>

            {stat.change && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                {stat.change}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <ul className="space-y-3">
            {recentActivities.map((activity, index) => (
              <li
                key={index}
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
              >
                <Activity className="w-4 h-4 text-blue-500" />
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            System Status
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Server</span>
              <span className="text-green-600 font-medium">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Database</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">API</span>
              <span className="text-green-600 font-medium">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
