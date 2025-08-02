'use client';

import { useState, useMemo } from 'react';
import Navbar from '../Navbar/page';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d88484', '#84d8d8'];

// Expanded mock data including year and month
const reportsData = [
  { issue: 'Stress', sessions: 120, users: 80, year: 2025, month: 8 },
  { issue: 'Anxiety', sessions: 95, users: 65, year: 2025, month: 8 },
  { issue: 'Depression', sessions: 70, users: 45, year: 2025, month: 8 },
  { issue: 'Sleep Issues', sessions: 50, users: 30, year: 2025, month: 7 },
  { issue: 'Relationship Problems', sessions: 30, users: 20, year: 2025, month: 7 },
  { issue: 'Stress', sessions: 100, users: 75, year: 2024, month: 12 },
  { issue: 'Anxiety', sessions: 80, users: 60, year: 2024, month: 12 },
  // Add more data as needed
];

const years = Array.from(new Set(reportsData.map((r) => r.year))).sort((a, b) => b - a);
const months = [
  { value: 0, label: 'All Months' },
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('line'); // 'line', 'pie', 'table'
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedMonth, setSelectedMonth] = useState(0);

  // Filter reports data by selected year and month (0 = all months)
  const filteredData = useMemo(() => {
    return reportsData.filter((d) => {
      const yearMatch = d.year === selectedYear;
      const monthMatch = selectedMonth === 0 || d.month === selectedMonth;
      return yearMatch && monthMatch;
    });
  }, [selectedYear, selectedMonth]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8 ml-60 bg-gradient-to-br from-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
            Client Issues Reports
          </h2>

          {/* Filters */}
          <div className="flex justify-center gap-6 mb-8">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 rounded-md border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-4 py-2 rounded-md border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {months.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 space-x-4">
            {['line', 'pie', 'table'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
                }`}
              >
                {tab === 'line' && 'Graph Report'}
                {tab === 'pie' && 'Pie Chart'}
                {tab === 'table' && 'Table Report'}
              </button>
            ))}
          </div>

          {/* Content */}
          <section>
            {activeTab === 'line' && <LineGraphReport data={filteredData} />}
            {activeTab === 'pie' && <PieChartReport data={filteredData} />}
            {activeTab === 'table' && <TableReport data={filteredData} />}
          </section>
        </div>
      </main>
    </>
  );
}

function LineGraphReport({ data }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="issue" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sessions" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="users" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

function PieChartReport({ data }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="sessions"
          nameKey="issue"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function TableReport({ data }) {
  return (
    <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
      <thead className="bg-purple-100 text-purple-800">
        <tr>
          <th className="py-3 px-6 text-left text-sm font-semibold">Issue</th>
          <th className="py-3 px-6 text-left text-sm font-semibold">Sessions</th>
          <th className="py-3 px-6 text-left text-sm font-semibold">Users Affected</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-gray-700">
        {data.map(({ issue, sessions, users }) => (
          <tr key={issue} className="hover:bg-purple-50">
            <td className="py-4 px-6">{issue}</td>
            <td className="py-4 px-6">{sessions}</td>
            <td className="py-4 px-6">{users}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
