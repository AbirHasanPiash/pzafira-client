import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate sending the form
    setTimeout(() => {
      setStatus("✅ Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen py-14 px-6 sm:px-10 md:px-16 bg-white text-gray-800"
    >
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Contact Us</h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Have a question, feedback, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        {/* Form & Info */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-md shadow-sm space-y-5"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-md font-medium transition"
            >
              Send Message
            </motion.button>

            {status && <p className="text-green-600 text-sm mt-2">{status}</p>}
          </form>

          {/* Contact Info */}
          <div className="space-y-6 text-sm sm:text-base text-gray-700">
            <div className="flex items-start gap-4">
              <Mail size={20} className="mt-1 text-blue-600" />
              <div>
                <p className="font-semibold">Email</p>
                <p>support@pzafira.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone size={20} className="mt-1 text-blue-600" />
              <div>
                <p className="font-semibold">Phone</p>
                <p>+880 123 456 789</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin size={20} className="mt-1 text-blue-600" />
              <div>
                <p className="font-semibold">Address</p>
                <p>Dhaka, Bangladesh</p>
              </div>
            </div>

            <div className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
              <p>Mon–Fri: 9am – 6pm</p>
              <p>Saturday: 10am – 4pm</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactUs;
