import { useEffect } from "react";
import { motion } from "framer-motion";

const jobOpenings = [
  {
    title: "Frontend Developer",
    location: "Remote",
    type: "Full-time",
    description:
      "We're looking for a creative React developer to help us build a modern shopping experience. You’ll work closely with designers to deliver pixel-perfect UIs.",
  },
  {
    title: "Graphic Designer",
    location: "Dhaka, Bangladesh",
    type: "Contract",
    description:
      "You’ll be responsible for creating stunning visual content for our website, social media, and marketing campaigns.",
  },
  {
    title: "Social Media Manager",
    location: "Hybrid",
    type: "Part-time",
    description:
      "Manage our social media presence, engage with our community, and help grow our brand online through strategic campaigns.",
  },
];

const Careers = () => {
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
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Careers at Pzafira
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            We&apos;re building more than a brand — we&apos;re building a movement. Join us to shape the future of fashion, tech, and creativity.
          </p>
        </div>

        {/* Why Work With Us */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <img
            src="images/office.jpeg"
            alt="Our Culture"
            className="rounded-md shadow-lg w-full object-cover h-full"
          />
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Why Work With Us?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              At StyleNest, we blend creativity, innovation, and inclusivity to empower our team and customers. You'll work in a culture that values fresh ideas, flexible work-life balance, and real growth opportunities.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 pt-2">
              <li>Remote flexibility & hybrid roles</li>
              <li>Supportive and diverse team</li>
              <li>Opportunities to grow fast</li>
              <li>Perks & performance bonuses</li>
            </ul>
          </div>
        </div>

        {/* Open Positions */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold">Open Positions</h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Browse our current openings and become a part of our story.
          </p>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 pt-6 text-left">
            {jobOpenings.map((job, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-md shadow hover:shadow-lg transition duration-300 space-y-3 border border-gray-100"
              >
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <div className="text-sm text-gray-500 flex flex-wrap gap-3">
                  <span>📍 {job.location}</span>
                  <span>💼 {job.type}</span>
                </div>
                <p className="text-sm text-gray-600">{job.description}</p>
                <button className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline transition">
                  Apply Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Careers;
