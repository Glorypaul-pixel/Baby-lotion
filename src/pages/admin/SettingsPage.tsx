// src/pages/admin/SettingsPage.tsx
import React, { useState } from "react";

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");

  // Sample state for settings
  const [siteTitle, setSiteTitle] = useState("Preferrable");
  const [logoUrl, setLogoUrl] = useState("");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireSpecial: true,
  });

  const tabs = [
    { id: "general", label: "General" },
    { id: "appearance", label: "Appearance" },
    { id: "users", label: "User Management" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "integrations", label: "Integrations" },
    { id: "logs", label: "System Logs" },
    { id: "maintenance", label: "Maintenance" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4 border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab.id
                ? "border-b-2 border-peach-500 text-peach-600"
                : "text-gray-700 dark:text-gray-300 hover:text-peach-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "general" && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Site Title</label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Logo URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <label>Enable Dark Mode</label>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-4">
            <p>Manage user roles, add or remove admins, and assign permissions.</p>
            {/* This can later be a table of users */}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
              />
              <label>Enable Email Notifications</label>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <label className="block font-medium mb-1">Password Policy</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label>Min Length:</label>
                <input
                  type="number"
                  value={passwordPolicy.minLength}
                  onChange={(e) =>
                    setPasswordPolicy({
                      ...passwordPolicy,
                      minLength: Number(e.target.value),
                    })
                  }
                  className="border px-2 py-1 rounded w-16"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={passwordPolicy.requireSpecial}
                  onChange={() =>
                    setPasswordPolicy({
                      ...passwordPolicy,
                      requireSpecial: !passwordPolicy.requireSpecial,
                    })
                  }
                />
                <label>Require special characters</label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "integrations" && (
          <div>
            <p>Add API keys for payment gateways, analytics, or other services here.</p>
          </div>
        )}

        {activeTab === "logs" && (
          <div>
            <p>View system logs, recent admin actions, and login history.</p>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div className="space-y-4">
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Clear Cache
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Backup Database
            </button>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button className="px-6 py-2 bg-peach-500 text-white rounded hover:bg-peach-600">
          Save Changes
        </button>
      </div>
    </div>
  );
};
