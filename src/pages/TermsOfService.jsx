import { useEffect } from "react";
import { motion } from "framer-motion";

const TermsOfService = () => {
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
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-5">
          <h1 className="text-3xl sm:text-4xl font-bold">Terms of Service</h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using Pzafira’s website and services.
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 text-sm sm:text-base text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Pzafira’s services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you must not use our platform.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">2. Use of Our Services</h2>
            <p>
              You may use our site for personal, non-commercial purposes only. Misuse, fraudulent activity, or attempts to harm the platform are strictly prohibited and may result in account termination.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">3. Account Responsibility</h2>
            <p>
              When creating an account with Pzafira, you are responsible for maintaining the confidentiality of your login credentials and all activity under your account.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">4. Product Information & Availability</h2>
            <p>
              We strive to provide accurate product descriptions and stock information. However, errors may occur, and we reserve the right to correct them and cancel orders if necessary.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">5. Payments & Transactions</h2>
            <p>
              All payments must be made using accepted payment methods listed on our website. Transactions are securely processed through our payment partners.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">6. Intellectual Property</h2>
            <p>
              All content, branding, and assets on Pzafira are the intellectual property of Pzafira or its licensors. You may not reproduce, modify, or redistribute content without written permission.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">7. Termination</h2>
            <p>
              We may suspend or terminate your access to Pzafira at any time if you violate these Terms or misuse the service in any way.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">8. Changes to Terms</h2>
            <p>
              Pzafira reserves the right to update or change these Terms at any time. Continued use of the platform after changes means you accept the new Terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">9. Contact</h2>
            <p>
              If you have any questions about these Terms, feel free to contact us at{" "}
              <a href="mailto:support@pzafira.com" className="text-blue-600 underline">
                support@pzafira.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TermsOfService;
