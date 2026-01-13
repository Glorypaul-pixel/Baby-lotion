import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Are BabyBliss products safe for newborns?',
      answer:
        'Yes! All our products are specifically formulated for delicate baby skin and are safe from day one. They are dermatologist-tested, hypoallergenic, and free from harsh chemicals, parabens, and artificial fragrances.',
    },
    {
      question: 'Can adults use baby lotion?',
      answer:
        'Absolutely! Our baby lotions are gentle and moisturizing for all skin types and ages. Many adults prefer baby products for their sensitive skin or simply enjoy the gentle, light fragrance.',
    },
    {
      question: 'What makes BabyBliss products different?',
      answer:
        "We use only premium natural ingredients, avoid harsh chemicals, and conduct rigorous testing. Every product is made with the same care we'd use for our own children. Plus, we're committed to sustainability and eco-friendly practices.",
    },
    {
      question: 'How should I store BabyBliss products?',
      answer:
        'Store products in a cool, dry place away from direct sunlight. Keep containers tightly closed when not in use. Our products have a shelf life of 12-24 months unopened, and should be used within 6 months after opening.',
    },
    {
      question: 'Do you test on animals?',
      answer:
        'No, we never test on animals. We are committed to cruelty-free practices and use alternative testing methods to ensure safety and effectiveness.',
    },
    {
      question: 'What if my baby has a reaction to a product?',
      answer:
        'While our products are formulated to be gentle and hypoallergenic, every baby is different. If your baby experiences any reaction, discontinue use immediately and consult your pediatrician. Contact us for a full refund.',
    },
    {
      question: 'Are your products organic?',
      answer:
        'Many of our ingredients are organic and all are natural. We source the highest quality ingredients and clearly list all components on our packaging. Look for our organic certification seal on specific products.',
    },
    {
      question: 'How long does shipping take?',
      answer:
        'Standard shipping is FREE and takes 3-5 business days. We also offer Express (1-2 days) and Next Day shipping options. Orders are processed Monday-Friday, excluding holidays.',
    },
    {
      question: 'What is your return policy?',
      answer:
        "We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, return it within 30 days for a full refund. Items must be unused and in original packaging.",
    },
    {
      question: 'Do you offer subscriptions?',
      answer:
        "Yes! Subscribe to your favorite products and save 15%. You can adjust delivery frequency, skip shipments, or cancel anytime. It's the easiest way to ensure you never run out.",
    },
    {
      question: 'Are your products fragrance-free?',
      answer:
        'We offer both fragranced and fragrance-free options. Our fragranced products use only natural, gentle scents. Check product descriptions for specific information.',
    },
    {
      question: 'Can I use BabyBliss products if my baby has eczema?',
      answer:
        'Our Sensitive Skin Baby Lotion is specifically formulated for babies with eczema and sensitive skin. However, we always recommend consulting with your pediatrician before using new products on babies with skin conditions.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-white to-peach-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-peach-500 to-peach-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know about BabyBliss
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-peach-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="font-bold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-peach-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-8 pb-6 text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-peach-500 to-peach-600 rounded-2xl p-8 text-white text-center shadow-lg animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="mb-6">
            Can't find the answer you're looking for? Our customer service team is always happy to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@babybliss.com"
              className="px-8 py-3 bg-white text-peach-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Email Us
            </a>
            <a
              href="tel:5551234567"
              className="px-8 py-3 bg-white/20 backdrop-blur text-white rounded-full font-semibold hover:bg-white/30 transition-colors"
            >
              Call (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
