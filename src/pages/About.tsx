import React from "react";
import { Heart, Leaf, Award, Users } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-white to-peach-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-peach-500 to-peach-600 bg-clip-text text-transparent">
            About Preferrable
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We believe every baby deserves the gentlest care. That's why we
            create premium, natural products with love.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="relative h-96 rounded-3xl overflow-hidden group animate-fade-in-up">
            <img
              src="/images/aboutImg.png"
              alt="Baby care"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="flex flex-col justify-center animate-fade-in-up animation-delay-200">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Our Story
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Preferrable was born from a parent's love and a simple desire: to
              create the safest, most gentle products for babies. Our founder,
              inspired by the arrival of their first child, couldn't find
              products that met their high standards for purity and gentleness.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Every Preferrable product is carefully formulated with natural
              ingredients, dermatologist-tested, and made with the same care
              we'd use for our own children. We believe that baby care should be
              simple, safe, and effective.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Today, thousands of families trust Preferrable to care for their
              little ones, and we're honored to be part of your family's
              journey.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            {
              icon: Heart,
              title: "Made with Love",
              description:
                "Every product is crafted with genuine care and attention to detail",
              color: "from-pink-400 to-peach-400",
            },
            {
              icon: Leaf,
              title: "100% Natural",
              description:
                "We use only the finest natural ingredients, free from harsh chemicals",
              color: "from-green-400 to-emerald-400",
            },
            {
              icon: Award,
              title: "Award Winning",
              description: "Recognized by pediatricians and parents worldwide",
              color: "from-yellow-400 to-amber-400",
            },
            {
              icon: Users,
              title: "Trusted by 50k+",
              description: "Over 50,000 happy families use our products daily",
              color: "from-blue-400 to-cyan-400",
            },
          ].map((value, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-white dark:bg-gray-800 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
              >
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Promise Section */}
        <div className="bg-gradient-to-br from-peach-100 to-peach-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-12 animate-fade-in-up">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              Our Promise
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-peach-500 dark:bg-peach-400 flex-shrink-0" />
                <p>
                  <strong>Safety First:</strong> Every ingredient is carefully
                  selected and tested to ensure it's safe for your baby's
                  delicate skin.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-peach-500 dark:bg-peach-400 flex-shrink-0" />
                <p>
                  <strong>Transparency:</strong> We list every ingredient
                  clearly. You'll never find hidden chemicals or mysterious
                  additives in our products.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-peach-500 dark:bg-peach-400 flex-shrink-0" />
                <p>
                  <strong>Sustainability:</strong> We're committed to protecting
                  the planet for future generations with eco-friendly packaging
                  and practices.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-peach-500 dark:bg-peach-400 flex-shrink-0" />
                <p>
                  <strong>Your Satisfaction:</strong> If you're not completely
                  happy, we'll make it right. Your trust means everything to us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
