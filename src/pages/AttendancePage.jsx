import React, { useState } from 'react';
import { Search, Filter, Users, UserCheck, Percent, PieChart } from 'lucide-react';

const mockParticipants = [
  { id: 1, name: 'Jane Doe', org: 'Global Health Init', role: 'Partner', regDate: '2026-10-01', status: 'Checked In', time: '08:30 AM' },
  { id: 2, name: 'John Smith', org: 'OAK Foundation', role: 'OAK Staff', regDate: '2026-10-02', status: 'Checked In', time: '08:15 AM' },
  { id: 3, name: 'Alice Johnson', org: 'Coordination Inc', role: 'Coordination Team', regDate: '2026-09-15', status: 'Checked In', time: '07:00 AM' },
  { id: 4, name: 'Bob Wilson', org: 'Tech for Good', role: 'Presenter', regDate: '2026-10-10', status: 'Pending', time: '-' },
  { id: 5, name: 'Carol White', org: 'Observer Group', role: 'Observer', regDate: '2026-10-20', status: 'Pending', time: '-' },
];

const AttendancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Dashboard</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
            Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Registered</p>
              <p className="text-2xl font-bold text-gray-900">342</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Attendees</p>
              <p className="text-2xl font-bold text-gray-900">289</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <Percent className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">84.5%</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg mr-4">
              <PieChart className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Top Role</p>
              <p className="text-lg font-bold text-gray-900">Partners (145)</p>
            </div>
          </div>
        </div>

        {/* Participant List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-xl font-bold text-gray-900">Participant List</h2>
              
              <div className="flex w-full sm:w-auto space-x-4">
                <div className="relative flex-1 sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search name, org, role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg. Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockParticipants.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{person.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.org}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {person.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.regDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${person.status === 'Checked In' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {person.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
