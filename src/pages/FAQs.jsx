import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is Pzafira?",
    answer:
      "Pzafira is a modern online fashion store offering stylish and affordable clothing for men, women, and kids.",
  },
  {
    question: "How can I track my order?",
    answer:
      "After placing your order, you’ll receive a tracking link via email. You can also view your order status in your account dashboard.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 7-day return policy for eligible products. Items must be unused, with original tags and packaging intact.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we only ship within Bangladesh. International shipping will be available soon!",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us at support@pzafira.com or via the Contact Us page. We're here to help!",
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen py-14 px-6 sm:px-10 md:px-16 bg-white text-gray-800"
    >
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Heading */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Can’t find the answer you’re looking for? Reach out to our support team anytime.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 bg-white shadow-sm rounded-md overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full px-5 py-4 flex justify-between items-center text-left text-sm sm:text-base font-medium hover:bg-gray-100 transition"
              >
                <span>{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-4 text-gray-600 text-sm sm:text-base"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FAQs;
