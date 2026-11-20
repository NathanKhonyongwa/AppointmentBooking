
'use client';

import { motion } from 'framer-motion';
import {
  Smile,
  HeartHandshake,
  CalendarDays,
  Leaf,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Clock3,
  Brain,
  Menu,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '../Customer/Navbar/page';

const benefits = [
  {
    icon: HeartHandshake,
    title: 'Personalized Support',
    description:
      'Connect with therapists who provide tailored guidance for your mental wellness journey.',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: Smile,
    title: 'Improved Emotional Health',
    description:
      'Build emotional strength, develop confidence and discover healthier ways to navigate everyday life.',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    icon: CalendarDays,
    title: 'Flexible Scheduling',
    description:
      'Book therapy sessions at a time that works for you, including convenient evening and weekend options.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Leaf,
    title: 'Mindful Growth',
    description:
      'Discover practical strategies for managing stress, anxiety and building lasting inner peace.',
    color: 'bg-green-100 text-green-700',
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: 'A Safe Space',
    description: 'Your wellness journey deserves privacy, respect and understanding.',
  },
  {
    icon: Clock3,
    title: 'Easy Booking',
    description: 'Find a suitable therapist and schedule your session with ease.',
  },
  {
    icon: Brain,
    title: 'Professional Guidance',
    description: 'Get support as you work towards a healthier and happier life.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-800">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative isolate flex min-h-[680px] items-center overflow-hidden sm:min-h-[740px] lg:min-h-[780px]">
        <motion.img
          src="/1.jpg"
          alt="A peaceful and welcoming therapy environment"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          initial={{ scale: 1.04 }}
          animate={{ scale: 1.12 }}
          transition={{
            duration: 18,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-950/65 to-purple-950/35" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-2xl text-center lg:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-purple-100 backdrop-blur-md">
              <Sparkles size={16} />
              Your journey to emotional wellness starts here
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Your Mental Health
              <span className="mt-2 block text-purple-300">
                Matters.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg lg:mx-0">
              Welcome to CHMW, a safe and supportive space where you can
              connect with professional therapists, find guidance and take
              positive steps towards a healthier, happier you.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/Customer/MyBookings"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-purple-600 px-8 py-4 font-semibold text-white shadow-xl shadow-purple-950/30 transition duration-300 hover:-translate-y-1 hover:bg-purple-700 sm:w-auto"
              >
                Book Your Session
                <ArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#benefits"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto"
              >
                Explore More
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-slate-200 lg:justify-start">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-purple-300" />
                Supportive environment
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-purple-300" />
                Your wellbeing matters
              </span>
            </div>
          </motion.div>

          {/* HERO SIDE CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:flex lg:justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-purple-400/30 blur-3xl" />
              <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-pink-400/30 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/30 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500 text-white">
                  <HeartHandshake size={34} />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-200">
                  CHMW Wellness
                </p>

                <h2 className="mt-4 text-3xl font-bold leading-snug text-white">
                  Take a moment for yourself.
                </h2>

                <p className="mt-4 leading-7 text-slate-200">
                  Every step towards understanding yourself is a step towards
                  a better tomorrow.
                </p>

                <div className="mt-8 border-t border-white/20 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-400/30 text-purple-100">
                      <Leaf size={22} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        Start your journey
                      </p>
                      <p className="text-sm text-slate-300">
                        One step at a time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 h-16 w-full rounded-t-[50%] bg-white" />
      </section>

      {/* INTRODUCTION */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
            Welcome to CHMW
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
            A better you begins with
            <span className="text-purple-600"> taking care of you.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            Life can bring challenges, and you do not have to navigate them
            alone. CHMW makes it easier to take the first step, connect with
            support and make your emotional wellbeing a priority.
          </p>
        </motion.div>
      </section>

      {/* BENEFITS SECTION */}
      <section
        id="benefits"
        className="bg-gradient-to-br from-purple-50 via-white to-pink-50 px-5 py-20 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
              Why Choose Us
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Support for Every Step
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              We believe everyone deserves the opportunity to grow, heal and
              live a fulfilling life.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group rounded-3xl border border-purple-100 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:p-8"
                >
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${benefit.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {benefit.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                    {benefit.description}
                  </p>

                  <div className="mt-6 h-1 w-12 rounded-full bg-purple-500 transition-all duration-300 group-hover:w-20" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
                Your wellbeing comes first
              </span>

              <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                Making your wellness journey simpler and more comfortable.
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                We want accessing support to feel simple. From discovering
                available therapists to arranging your appointment, CHMW
                provides a welcoming experience throughout your journey.
              </p>

              <Link
                href="/Customer/MyBookings"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-purple-600 px-7 py-3.5 font-semibold text-white transition hover:bg-purple-700"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition hover:border-purple-200 hover:bg-purple-50"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                      <Icon size={25} />
                    </div>

                    <h3 className="font-bold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 px-6 py-16 text-center shadow-xl sm:px-12 sm:py-20"
        >
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-pink-300/20 blur-2xl" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <Sparkles className="mx-auto mb-5 text-purple-100" size={35} />

            <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
              Your journey starts with one step.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-purple-100">
              Give yourself the time and care you deserve. Connect with a
              therapist and take the next step towards emotional wellness.
            </p>

            <Link
              href="/Customer/MyBookings"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-purple-700 shadow-lg transition hover:-translate-y-1 hover:bg-purple-50"
            >
              Book an Appointment
              <ArrowRight size={19} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-slate-950 px-5 py-10 text-center text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-2xl font-bold tracking-wide">
            CHMW<span className="text-purple-400">.</span>
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
            A welcoming space dedicated to supporting your mental and
            emotional wellness.
          </p>

          <div className="mt-7 border-t border-white/10 pt-6 text-xs text-slate-500 sm:text-sm">
            © {new Date().getFullYear()} CHMW. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
