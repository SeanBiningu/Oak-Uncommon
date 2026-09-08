import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import QRCodePage from './pages/QRCodePage';
import CheckInPage from './pages/CheckInPage';
import AttendancePage from './pages/AttendancePage';
import ProgramPage from './pages/ProgramPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Navigation Bar for Dev Purposes to easily navigate between pages */}
        <nav className="bg-white border-b border-gray-200 px-4 py-3 flex space-x-4 shadow-sm z-50 overflow-x-auto">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">Registration (1)</Link>
          <Link to="/qr-code" className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">QR Code (2)</Link>
          <Link to="/check-in" className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">Check-In (3)</Link>
          <Link to="/attendance" className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">Attendance (4)</Link>
          <Link to="/program" className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">Program (5)</Link>
        </nav>
        
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<RegistrationPage />} />
            <Route path="/qr-code" element={<QRCodePage />} />
            <Route path="/check-in" element={<CheckInPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/program" element={<ProgramPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
