'use client';

import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <main className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md my-12 font-sans">
      <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">
        Terms and Conditions
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="text-gray-700 leading-relaxed">
          Welcome to our Therapy Service platform. These Terms and Conditions (“Terms”) govern your
          access to and use of our services. By using our platform, you agree to be legally bound
          by these Terms. Please read them carefully.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
        <p className="text-gray-700 leading-relaxed">
          You must be at least 18 years old to use our services. If you are under 18, please obtain
          consent from a parent or legal guardian before registering or booking sessions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
          <li>Provide accurate, complete, and current information during registration and booking.</li>
          <li>Ensure timely attendance to scheduled therapy sessions.</li>
          <li>Respect the privacy and confidentiality of therapists and other users.</li>
          <li>Comply with all applicable laws and regulations while using the platform.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Appointment Booking & Cancellations</h2>
        <p className="text-gray-700 leading-relaxed mb-2">
          When booking appointments, you agree to:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
          <li>Book sessions in accordance with the availability provided.</li>
          <li>Provide at least 24 hours’ notice for cancellations or rescheduling.</li>
          <li>Understand that late cancellations or no-shows may incur fees.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Confidentiality</h2>
        <p className="text-gray-700 leading-relaxed">
          All therapy sessions are confidential. We handle your data in accordance with our Privacy
          Policy. Confidentiality may be legally breached in cases involving harm to self or others.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Payments & Fees</h2>
        <p className="text-gray-700 leading-relaxed">
          Payment terms for therapy sessions will be clearly communicated during booking. Failure
          to pay may result in suspension or termination of access to our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
        <p className="text-gray-700 leading-relaxed">
          Our platform and services are provided “as is” without warranties. We are not liable for
          any damages arising from use of the services or therapy outcomes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
        <p className="text-gray-700 leading-relaxed">
          We reserve the right to update these Terms at any time. Continued use of the service
          after changes constitutes acceptance of the new terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
        <p className="text-gray-700 leading-relaxed">
          For questions or concerns regarding these Terms, please contact us at{' '}
          <a href="mailto:support@therapyservice.com" className="text-purple-600 underline">
            support@therapyservice.com
          </a>.
        </p>
      </section>

      <footer className="text-center text-gray-500 text-sm mt-12">
        &copy; {new Date().getFullYear()} Therapy Service. All rights reserved.
      </footer>
    </main>
  );
}
