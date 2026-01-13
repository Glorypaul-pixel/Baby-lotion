import React from 'react';
import { Truck, Package, Globe, Clock } from 'lucide-react';

export const Shipping: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-white to-peach-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-peach-500 to-peach-600 bg-clip-text text-transparent">
            Shipping Information
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Fast, reliable delivery to your doorstep
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-fade-in-up">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-peach-400 to-peach-500 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Shipping Methods
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-peach-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Standard Shipping - FREE
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Delivery in 3-5 business days. Available on all orders.
                </p>
              </div>

              <div className="p-4 bg-peach-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Express Shipping - $9.99
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Delivery in 1-2 business days. Perfect when you need it fast.
                </p>
              </div>

              <div className="p-4 bg-peach-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Next Day Shipping - $19.99
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Order by 2 PM for next-day delivery. Available in select areas.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-fade-in-up animation-delay-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order Processing
              </h2>
            </div>

            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Orders are processed Monday through Friday, excluding holidays. Orders placed after 2 PM will be processed the next business day.
              </p>
              <p>
                You'll receive a confirmation email when your order is placed, and a shipping notification with tracking information once your order ships.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-fade-in-up animation-delay-400">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                International Shipping
              </h2>
            </div>

            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
               We currently ship to Ghana, Cameroon, Togo, and other parts of Africa, as well as select international destinations. Shipping times and costs vary depending on location.
              </p>
              <p>
                International orders may be subject to customs fees, duties, and taxes, which are the responsibility of the customer.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-peach-500 to-peach-600 rounded-2xl p-8 text-white shadow-lg animate-fade-in-up animation-delay-600">
            <div className="flex items-center space-x-4 mb-6">
              <Clock className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Need Help?</h2>
            </div>
            <p className="mb-4">
              Have questions about shipping? Our customer service team is here to help!
            </p>
            <p className="font-semibold">
              Contact us at tsmglobalcosmetic or call (+234) 080-6703-0009
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
