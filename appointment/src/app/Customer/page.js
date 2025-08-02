'use client';

import { motion } from 'framer-motion';
import { Smile, HeartHandshake, CalendarDays, Leaf } from 'lucide-react';
import Navbar from '../Customer/Navbar/page';

export default function LandingPage() {
  const benefits = [
    {
      icon: HeartHandshake,
      title: 'Personalized Support',
      description: 'Connect with therapists who provide tailored guidance for your mental wellness journey.',
    },
    {
      icon: Smile,
      title: 'Improved Emotional Health',
      description: 'Therapy empowers you to smile more, worry less, and gain confidence in everyday life.',
    },
    {
      icon: CalendarDays,
      title: 'Flexible Scheduling',
      description: 'Book sessions when it’s convenient for you—day, evening, or weekends.',
    },
    {
      icon: Leaf,
      title: 'Mindful Growth',
      description: 'Learn practical techniques to handle stress, anxiety, and foster inner peace.',
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section with Background Image */}
      <section className="relative w-full h-[90vh] overflow-hidden flex items-center justify-center">
        <img
          src="/1.jpg" 
          alt="Therapy background"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute w-full h-full bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-center z-10 px-6 max-w-3xl"
        >
          <h1 className="text-white text-4xl md:text-6xl font-extrabold mb-4">
            Welcome to MindBloom 🌿
          </h1>
          <p className="text-white text-lg md:text-xl">
            A comforting space to book therapy sessions and take charge of your emotional wellness.
          </p>
          <motion.a
            href="/Customer/MyBookings"
            className="mt-8 inline-block bg-purple-600 text-white px-6 py-3 text-lg rounded-full shadow-lg hover:bg-purple-700 transition"
            whileHover={{ scale: 1.05 }}
          >
            Book Your First Session
          </motion.a>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 px-6 flex flex-col items-center">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-purple-100 hover:shadow-xl transition"
              whileHover={{ scale: 1.03 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4 }}
            >
              <benefit.icon className="text-purple-600 w-12 h-12 mb-4" />
              <h3 className="text-lg font-bold text-purple-700 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
