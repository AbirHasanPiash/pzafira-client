import { useEffect } from "react";
import { motion } from "framer-motion";

const ShippingAndReturns = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen py-14 px-6 sm:px-10 md:px-16 bg-white text-gray-800"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Heading */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Shipping & Returns</h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need to know about how we deliver your fashion and handle returns.
          </p>
        </div>

        {/* Shipping Policy */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Shipping Policy</h2>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 space-y-2">
            <li>We currently ship to all districts in Bangladesh.</li>
            <li>Orders are processed within 1–2 business days after confirmation.</li>
            <li>Standard delivery time: 2–5 business days depending on your location.</li>
            <li>Shipping is free for orders over ৳2000. A flat rate of ৳70 applies to smaller orders.</li>
            <li>You will receive a tracking link once your order is dispatched.</li>
          </ul>
        </div>

        {/* Return Policy */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Return & Exchange Policy</h2>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 space-y-2">
            <li>Items can be returned within 7 days of delivery.</li>
            <li>Products must be unworn, unwashed, and in original condition with tags.</li>
            <li>To initiate a return, contact us at <a href="mailto:support@pzafira.com" className="text-blue-600 underline">support@pzafira.com</a>.</li>
            <li>We’ll arrange pickup or ask you to return via courier service depending on your location.</li>
            <li>Refunds are processed within 5–7 business days after we receive the returned product.</li>
            <li>Exchanges can be done for size or color changes (subject to availability).</li>
          </ul>
        </div>

        {/* Note */}
        <p className="text-sm text-gray-500">
          For hygiene reasons, certain items like innerwear are not eligible for return or exchange.
        </p>
      </div>
    </motion.section>
  );
};

export default ShippingAndReturns;
