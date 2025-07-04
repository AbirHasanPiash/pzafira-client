import { useEffect } from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  // Auto scroll to top on first render
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
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            About Us
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            We&apos;re more than just a clothing store — we&apos;re a community of fashion lovers, trendsetters, and quality seekers. Learn more about our story and mission.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <img
            src="images/our_story.jpeg"
            alt="Our Mission"
            className="rounded-md shadow-lg w-full object-cover h-full"
          />
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Our Mission
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              At <strong>Pzafira</strong>, we aim to deliver trendy, high-quality fashion at affordable prices. Our collections are thoughtfully curated to reflect both modern trends and timeless classics — making fashion inclusive, sustainable, and exciting.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold">Meet Our Team</h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            A passionate crew of designers, developers, and creative thinkers.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 pt-6">
            {[
              { name: "Abir Hasan", role: "Founder & CEO", img: "https://i.pravatar.cc/150?img=1" },
              { name: "Jannat Ara", role: "Creative Director", img: "https://i.pravatar.cc/150?img=5" },
              { name: "Nancy Khan", role: "Marketing Lead", img: "https://i.pravatar.cc/150?img=9" },
            ].map((member, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-md shadow hover:shadow-lg transition duration-300 text-center"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 mx-auto rounded-full mb-4 object-cover border-2 border-gray-200"
                />
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutUs;
