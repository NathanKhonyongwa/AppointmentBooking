'use client';

import { motion } from 'framer-motion';
import { Smile, HeartHandshake, CalendarDays, Leaf } from 'lucide-react';
import Navbar from '../Customer/Navbar/page';

export default function LandingPage() {
  const benefits = [
    {
      icon: HeartHandshake,
      title: 'Personalized Support',
      description:
        'Connect with therapists who provide tailored guidance for your mental wellness journey.',
    },
    {
      icon: Smile,
      title: 'Improved Emotional Health',
      description:
        'Therapy empowers you to smile more, worry less, and gain confidence in everyday life.',
    },
    {
      icon: CalendarDays,
      title: 'Flexible Scheduling',
      description:
        'Book sessions when it’s convenient for you—day, evening, or weekends.',
    },
    {
      icon: Leaf,
      title: 'Mindful Growth',
      description:
        'Learn practical techniques to handle stress, anxiety, and foster inner peace.',
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-[75vh] sm:min-h-[80vh] md:min-h-[90vh] overflow-hidden flex items-center justify-center px-3 sm:px-6 lg:px-12">
        {/* Background Image with mobile zoom animation */}
        <motion.img
          src="/1.jpg"
          alt="Therapy background"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{
            duration: 10, // slow zoom
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-center z-10 px-3 sm:px-4 max-w-[90%] sm:max-w-2xl lg:max-w-4xl"
        >
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 leading-snug sm:leading-tight">
            Welcome to CHMW
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl">
            A comforting space to book therapy sessions and take charge of your emotional wellness.
          </p>
          <motion.a
            href="/Customer/MyBookings"
            className="mt-5 sm:mt-8 inline-block bg-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-lg rounded-full shadow-lg hover:bg-purple-700 transition"
            whileHover={{ scale: 1.05 }}
          >
            Book Your First Session
          </motion.a>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-10 sm:py-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 px-3 sm:px-6 lg:px-12 flex flex-col items-center">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-8 max-w-6xl w-full"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 flex flex-col items-center text-center border border-purple-100 hover:shadow-xl transition"
              whileHover={{ scale: 1.03 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <benefit.icon className="text-purple-600 w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-bold text-purple-700 mb-1 sm:mb-2">
                {benefit.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
