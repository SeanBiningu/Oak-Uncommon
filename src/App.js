import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EventShell from './components/EventShell';
import './App.css';
import './Refined.css';
import RegistrationPage from './pages/RegistrationPage';
import QRCodePage from './pages/QRCodePage';
import CheckInPage from './pages/CheckInPage';
import AttendancePage from './pages/AttendancePage';
import ProgramPage from './pages/ProgramPage';
import PartnersPage from './pages/PartnersPage';

export default function App() { return <Router><EventShell><Routes><Route path="/" element={<RegistrationPage />} /><Route path="/qr-code" element={<QRCodePage />} /><Route path="/check-in" element={<CheckInPage />} /><Route path="/check-in/success" element={<CheckInPage initialStatus="success" />} /><Route path="/check-in/error" element={<CheckInPage initialStatus="error" />} /><Route path="/attendance" element={<AttendancePage />} /><Route path="/program" element={<ProgramPage />} /><Route path="/program/details" element={<ProgramPage initialSessionId={1} />} /><Route path="/partners" element={<PartnersPage />} /><Route path="/partners/details" element={<PartnersPage initialPartnerId={1} />} /></Routes></EventShell></Router>; }
