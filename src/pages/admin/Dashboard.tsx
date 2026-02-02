// src/pages/admin/Dashboard.tsx
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardPage } from "./DashboardPage";
import { ProductsPage } from "./ProductsPage";
import { OrdersPage } from "./OrdersPage";
import { UsersPage } from "./UsersPage";
import { ContentPage } from "./ContentPage";
import { SettingsPage } from "./SettingsPage";

export const AdminDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "products":
        return <ProductsPage />;
      case "orders":
        return <OrdersPage />;
      case "users":
        return <UsersPage />;
      case "content":
        return <ContentPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen mt-20">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-6  overflow-auto">
        {renderContent()}

      </main>
    </div>
  );
};
