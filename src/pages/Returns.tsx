import React from "react";
import { RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const Returns: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-white to-peach-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-peach-500 to-peach-600 bg-clip-text text-transparent">
            Returns & Exchanges
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your satisfaction is our priority
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-fade-in-up">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-peach-400 to-peach-500 rounded-xl flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                30-Day Return Policy
              </h2>
            </div>

            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We want you to be completely satisfied with your purchase. If
                you're not happy with your order, you can return it within 30
                days of delivery for a full refund or exchange.
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                To be eligible for a return, items must be:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start space-x-2">
                  <span className="text-peach-500 mt-1">•</span>
                  <span>
                    Unused and in the same condition that you received them
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-peach-500 mt-1">•</span>
                  <span>In the original packaging</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-peach-500 mt-1">•</span>
                  <span>Accompanied by proof of purchase</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-fade-in-up animation-delay-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              How to Return an Item
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-peach-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-peach-600 dark:text-peach-400">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    Contact Us
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Email tsmglobalcosmetic or call (+234) 080-6703-0009 to
                    initiate your return. We'll provide you with a return
                    authorization number.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-peach-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-peach-600 dark:text-peach-400">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    Package Your Item
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Securely pack the item in its original packaging. Include
                    your return authorization number and proof of purchase.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-peach-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-peach-600 dark:text-peach-400">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    Ship It Back
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Ship the package to the address provided in your return
                    authorization email. We recommend using a trackable shipping
                    method.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-peach-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-peach-600 dark:text-peach-400">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    Get Your Refund
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Once we receive your return, we'll process it within 5-7
                    business days. Your refund will be issued to your original
                    payment method.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 animate-fade-in-up animation-delay-400">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Returnable
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Unopened products</li>
                <li>• Damaged items</li>
                <li>• Wrong items sent</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 animate-fade-in-up animation-delay-500">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Non-Returnable
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Opened products</li>
                <li>• Items past 30 days</li>
                <li>• Gift cards</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 animate-fade-in-up animation-delay-600">
              <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Important Notes
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Free return shipping</li>
                <li>• Exchanges available</li>
                <li>• 5-7 day processing</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-peach-500 to-peach-600 rounded-2xl p-8 text-white shadow-lg animate-fade-in-up animation-delay-700">
            <h2 className="text-2xl font-bold mb-4">
              Questions About Returns?
            </h2>
            <p className="mb-4">
              Our customer service team is here to help make your return process
              as smooth as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:glowreyahe4ma@gmail.com?subject=Customer%20Enquiry&body=Hello%20Glowreya%20Team,%0D%0A%0D%0AI%20would%20like%20to%20make%20an%20enquiry."
                className="px-6 py-3 bg-white text-peach-600 rounded-full font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Email Customer Support
              </a>

              <a
                href="tel:+2348142401236"
                className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-full font-semibold hover:bg-white/30 transition-colors text-center"
              >
                Call Us (+234) 814-240-1236
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
