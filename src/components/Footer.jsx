import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="flex justify-center">
        <div className="max-w-7xl grid grid-cols-1 px-6 md:px-16 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-white">Pzafira</span>
            </div>
            <p className="text-gray-400 text-sm">
              Bringing you the best fashion collections for every season and
              occasion.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white transition">
                <a href="#">About Us</a>
              </li>
              <li className="hover:text-white transition">
                <a href="#">Careers</a>
              </li>
              <li className="hover:text-white transition">
                <a href="#">Privacy Policy</a>
              </li>
              <li className="hover:text-white transition">
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white transition">
                <a href="#">Contact Us</a>
              </li>
              <li className="hover:text-white transition">
                <a href="#">FAQs</a>
              </li>
              <li className="hover:text-white transition">
                <a href="#">Shipping & Returns</a>
              </li>
              <li className="hover:text-white transition">
                <a href="#">Order Tracking</a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin size={16} /> Dhaka, Bangladesh
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> support@pzafira.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} /> +880 123-456-789
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="hover:text-white duration-300 ease-in-out hover:scale-110"
              >
                <Facebook />
              </a>
              <a
                href="#"
                className="hover:text-white duration-300 ease-in-out hover:scale-110"
              >
                <Instagram />
              </a>
              <a
                href="#"
                className="hover:text-white duration-300 ease-in-out hover:scale-110"
              >
                <Twitter />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-sm text-center text-gray-500">
        &copy; {new Date().getFullYear()} Pzafira. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
