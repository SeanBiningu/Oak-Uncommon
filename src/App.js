import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import EventShell from './components/EventShell';
import './App.css';
import './Refined.css';
import RegistrationPage from './pages/RegistrationPage';
import QRCodePage from './pages/QRCodePage';
import CheckInPage from './pages/CheckInPage';
import AttendancePage from './pages/AttendancePage';
import ProgramPage from './pages/ProgramPage';
import PartnersPage from './pages/PartnersPage';
import AccessPage from './pages/AccessPage';
import RequireAccess from './components/RequireAccess';

const allRoles = ['participant', 'oak_staff', 'coordination_team', 'presenter', 'observer', 'admin'];
export default function App() { return <Router><EventShell><Routes><Route path="/" element={<RegistrationPage />} /><Route path="/access" element={<AccessPage />} /><Route path="/qr-code" element={<RequireAccess roles={['participant', 'admin']}><QRCodePage /></RequireAccess>} /><Route path="/check-in" element={<RequireAccess roles={['coordination_team', 'admin']}><CheckInPage /></RequireAccess>} /><Route path="/attendance" element={<RequireAccess roles={['coordination_team', 'admin']}><AttendancePage /></RequireAccess>} /><Route path="/program" element={<RequireAccess roles={['oak_staff', 'coordination_team', 'presenter', 'observer', 'admin']}><ProgramPage /></RequireAccess>} /><Route path="/partners" element={<RequireAccess roles={allRoles}><PartnersPage /></RequireAccess>} /><Route path="/partners/:partnerId" element={<RequireAccess roles={allRoles}><PartnersPage /></RequireAccess>} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></EventShell></Router>; }
