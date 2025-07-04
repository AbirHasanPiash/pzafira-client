import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/newsletter/subscribe/", { email });
      toast.success("🎉 Subscribed successfully!");
      setEmail("");
    } catch (err) {
      toast.error("⚠️ Subscription failed or already subscribed.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="w-full py-14"
    >
      <div className="container max-w-7xl px-6 sm:px-10 md:px-16 mx-auto">
        <div className="bg-white/60 backdrop-blur-md border border-gray-200 shadow-xl px-6 sm:px-12 py-10 sm:py-14 space-y-6 md:space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
              Stay in Style with Our Newsletter
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
              Be the first to hear about fresh arrivals, limited-time deals, and seasonal fashion trends.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="relative w-full sm:w-2/3">
              <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/40 transition rounded-md outline-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-black hover:bg-gray-900 text-white text-sm sm:text-base px-6 py-2.5 rounded-md font-medium shadow-sm transition"
            >
              Subscribe
            </motion.button>
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default NewsletterSection;
