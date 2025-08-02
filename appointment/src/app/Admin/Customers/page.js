'use client';

import { useState } from 'react';
import Navbar from '../Navbar/page';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const clientsMock = [
  { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com', phone: '+265 999 123 456', joined: '2024-01-12' },
  { id: 2, name: 'John Banda', email: 'john.banda@example.com', phone: '+265 998 654 321', joined: '2023-11-05' },
  { id: 3, name: 'Mary Smith', email: 'mary.smith@example.com', phone: '+265 997 456 789', joined: '2024-04-20' },
  { id: 4, name: 'Peter Johnson', email: 'peter.johnson@example.com', phone: '+265 996 123 987', joined: '2024-03-15' },
  { id: 5, name: 'Grace Lee', email: 'grace.lee@example.com', phone: '+265 995 321 654', joined: '2023-12-01' },
  { id: 6, name: 'Michael Brown', email: 'michael.brown@example.com', phone: '+265 994 789 123', joined: '2024-02-22' },
  { id: 7, name: 'Linda Davis', email: 'linda.davis@example.com', phone: '+265 993 456 789', joined: '2024-05-03' },
  { id: 8, name: 'Robert Wilson', email: 'robert.wilson@example.com', phone: '+265 992 654 321', joined: '2023-10-11' },
  { id: 9, name: 'Susan Miller', email: 'susan.miller@example.com', phone: '+265 991 123 456', joined: '2024-06-07' },
  { id: 10, name: 'David Martinez', email: 'david.martinez@example.com', phone: '+265 990 321 987', joined: '2023-09-29' },
];

const ITEMS_PER_PAGE = 5;

export default function ClientsPage() {
  const [clients] = useState(clientsMock);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(clients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentClients = clients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8 ml-60 bg-gradient-to-br from-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Clients</h2>

          {clients.length === 0 ? (
            <p className="text-center text-gray-500">No clients found.</p>
          ) : (
            <>
              <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                <table className="min-w-full divide-y divide-purple-200">
                  <thead className="bg-purple-100 text-purple-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Date Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {currentClients.map(({ id, name, email, phone, joined }) => (
                      <tr key={id} className="hover:bg-purple-50">
                        <td className="px-6 py-4 whitespace-nowrap">{name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-end items-center gap-4 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 text-purple-700 hover:text-purple-900 disabled:opacity-50"
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                  Prev
                </button>
                <span className="text-gray-600">
                  Page <strong>{currentPage}</strong> of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 text-purple-700 hover:text-purple-900 disabled:opacity-50"
                  aria-label="Next page"
                >
                  Next
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
