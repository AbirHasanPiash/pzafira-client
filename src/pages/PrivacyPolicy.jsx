import { useEffect } from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen py-14 px-6 md:px-16 bg-gray-50 text-gray-800"
    >
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Your privacy is important to us. This Privacy Policy explains how Pzafira collects, uses, and protects your personal information.
          </p>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, place an order, subscribe to our newsletter, or contact customer service. This may include your name, email, phone number, shipping address, and payment details.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To process orders and deliver products</li>
              <li>To communicate with you regarding purchases or customer support</li>
              <li>To send newsletters and promotional emails (you can opt-out anytime)</li>
              <li>To improve our website and services</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">3. Sharing Your Information</h2>
            <p>
              We never sell your personal information. We may share data with trusted third-party services for payment processing, shipping, or analytics — only as necessary to fulfill your order and improve our services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">4. Cookies & Tracking</h2>
            <p>
              We use cookies and similar technologies to personalize your shopping experience, remember preferences, and analyze site traffic. You can control cookie preferences through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including HTTPS encryption and secure payment gateways. However, no system is 100% secure — please use strong passwords and protect your account.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. You may also unsubscribe from marketing emails at any time by clicking the unsubscribe link in the footer.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy occasionally. Changes will be posted on this page with an updated effective date.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">8. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, feel free to contact us at <a href="mailto:support@Pzafira.com" className="text-blue-600 underline">support@Pzafira.com</a>.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default PrivacyPolicy;
