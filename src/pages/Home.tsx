import React, { useEffect, useState } from "react";
import {
  Heart,
  Star,
  Shield,
  Award,
  Leaf,
  Sparkles,
  Quote,
  ArrowRight,
} from "lucide-react";

type HomeProps = {
  onNavigate: (page: string) => void;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Gentle Baby Lotion",
        description: "Moisturizes and protects delicate skin naturally.",
        price: 12.99,
        image_url: "/images/pink.png",
      },
      {
        id: 2,
        name: "Organic Baby Shampoo",
        description: "Tear-free and enriched with natural ingredients.",
        price: 9.99,
        image_url: "/images/green.png",
      },
      {
        id: 3,
        name: "Soothing Baby Oil",
        description: "Nourishes and keeps baby’s skin soft and smooth.",
        price: 14.99,
        image_url: "/images/orange.png",
      },
    ];

    setFeaturedProducts(mockProducts);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section
        id="home"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-semibold">
              100% Organic Active
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Natural Care for Your Little Ones
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              PREFERABLE Kids & Teens Natural & Moisturizing Body Milk - Proven
              to nourish like a prince and princess with organic active
              ingredients
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate("products")}
                className="group px-8 py-4 bg-gradient-to-r from-peach-500 to-peach-600 dark:from-orange-600 dark:to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate("about")}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-peach-600 dark:text-peach-400 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-peach-500 dark:border-peach-400"
              >
                Learn More
              </button>
            </div>
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Paraben Free
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="w-6 h-6 text-green-500 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  100% Organic
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-pink-500 dark:text-pink-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dermatologist Tested
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-pink-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl transform rotate-3"></div>
            <div className="relative bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-2xl">
              <img
                src="/images/newLogo.png"
                alt="Preferable Kids & Teens Body Milk Products"
                className="w-full h-auto rounded-2xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-xl">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-orange-400 dark:bg-orange-600 rounded-full border-2 border-white dark:border-gray-800"></div>
                  <div className="w-8 h-8 bg-pink-400 dark:bg-pink-600 rounded-full border-2 border-white dark:border-gray-800"></div>
                  <div className="w-8 h-8 bg-orange-300 dark:bg-orange-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                    1000+ Happy Parents
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        id="products"
        className="py-20 bg-gradient-to-br from-peach-50 to-peach-100 dark:from-gray-800 dark:to-gray-700 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Our most loved products for your baby's care
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-64 overflow-hidden bg-peach-100 dark:bg-gray-700">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-peach-500 dark:bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-peach-600 dark:text-pink-400">
                      ${product.price}
                    </span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-peach-400 dark:fill-pink-400 text-peach-400 dark:text-pink-400"
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate("products")}
                    className="mt-4 w-full py-3 bg-gradient-to-r from-peach-500 to-peach-600 dark:from-orange-600 dark:to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose PREFERABLE?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Trusted by thousands of parents worldwide
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Made with Love",
                description:
                  "Every product is crafted with care and the finest natural ingredients",
              },
              {
                icon: Shield,
                title: "Dermatologist Tested",
                description:
                  "Clinically proven safe for sensitive baby skin and hypoallergenic",
              },
              {
                icon: Sparkles,
                title: "Natural Ingredients",
                description:
                  "Free from harsh chemicals, parabens, and artificial fragrances",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-peach-50 dark:from-gray-800 to-white dark:to-gray-900 border border-peach-200 dark:border-gray-700 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-peach-400 to-peach-500 dark:from-orange-600 dark:to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white dark:from-gray-900 to-orange-50 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Parents Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real experiences from families who love PREFERABLE
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Quote className="w-10 h-10 text-orange-400 dark:text-pink-400 mb-4" />
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "Sample testimonial text for parent {idx + 1}."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 dark:from-pink-500 dark:to-orange-600 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Parent {idx + 1}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Mother/Father of {idx + 1}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 dark:from-orange-600 dark:to-pink-600 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Give Your Child The Best Natural Care
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of happy parents who trust PREFERABLE for their
            children's skincare
          </p>
          <button className="bg-white text-orange-600 dark:text-orange-500 px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105">
            Order Now
          </button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-100 dark:bg-gray-800 rounded-3xl p-12 text-center text-black dark:text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Reach Out to Us
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Have questions or need assistance? Message our customer service
              directly on WhatsApp.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const nameInput = (
                  e.currentTarget.elements.namedItem("name") as HTMLInputElement
                ).value;
                const emailInput = (
                  e.currentTarget.elements.namedItem(
                    "email"
                  ) as HTMLInputElement
                ).value;
                const messageInput = (
                  e.currentTarget.elements.namedItem(
                    "message"
                  ) as HTMLTextAreaElement
                ).value;

                const whatsappNumber = "2348142401236";
                const message = `Hello Preferable Team! 👋\n\nMy name is ${nameInput}.\nEmail: ${emailInput}\nMessage: ${messageInput}\n\nLooking forward to your response. Thank you!`;
                const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  message
                )}`;

                window.open(url, "_blank");
              }}
              className="max-w-md mx-auto flex flex-col gap-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="px-6 py-4 rounded-full text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-white/50"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="px-6 py-4 rounded-full text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-white/50"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                required
                className="px-6 py-4 rounded-2xl text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-white/50 resize-none h-32"
              ></textarea>
              <button
                type="submit"
                className="px-8 py-4 bg-white dark:bg-gray-700 text-peach-600 dark:text-peach-400 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              >
                Message Us
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
