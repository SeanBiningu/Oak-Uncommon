import React, { useState } from 'react';
import { Camera, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react';

const CheckInPage = () => {
  const [scanStatus, setScanStatus] = useState('scanning'); // scanning, success, error
  const [participant, setParticipant] = useState(null);
  const [errorType, setErrorType] = useState(null);

  const simulateScanSuccess = () => {
    setParticipant({
      name: 'John Smith',
      organization: 'OAK Foundation',
      role: 'Presenter',
      status: 'Registered',
      checkInTime: new Date().toLocaleTimeString()
    });
    setScanStatus('success');
  };

  const simulateScanError = () => {
    setErrorType('Invalid QR Code');
    setScanStatus('error');
  };

  const resetScan = () => {
    setScanStatus('scanning');
    setParticipant(null);
    setErrorType(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white text-center">
          <h2 className="text-xl font-bold">Coordination Check-In</h2>
        </div>

        <div className="p-6">
          {scanStatus === 'scanning' && (
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden border-4 border-gray-800 flex flex-col items-center justify-center">
                <Camera className="w-16 h-16 text-gray-500 mb-4" />
                <span className="text-gray-400">Camera Feed Active</span>
                
                {/* Scanner reticle */}
                <div className="absolute inset-8 border-2 border-green-500/50 rounded-lg">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center text-blue-600 font-medium">
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Scanning for QR Codes...
              </div>

              {/* Dev Simulation Buttons */}
              <div className="mt-8 flex gap-4 w-full">
                <button onClick={simulateScanSuccess} className="flex-1 bg-green-100 text-green-700 py-2 rounded-md text-sm font-medium">Simulate Success</button>
                <button onClick={simulateScanError} className="flex-1 bg-red-100 text-red-700 py-2 rounded-md text-sm font-medium">Simulate Error</button>
              </div>
            </div>
          )}

          {scanStatus === 'success' && participant && (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Participant Successfully Checked In</h3>
              
              <div className="w-full mt-6 bg-gray-50 rounded-lg p-4 text-left space-y-3">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Full Name</span>
                  <span className="font-medium text-gray-900">{participant.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Organization</span>
                  <span className="font-medium text-gray-900">{participant.organization}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium text-gray-900">{participant.role}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium text-green-600">{participant.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Check In Time</span>
                  <span className="font-medium text-gray-900">{participant.checkInTime}</span>
                </div>
              </div>

              <button onClick={resetScan} className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
                Scan Next Participant
              </button>
            </div>
          )}

          {scanStatus === 'error' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">QR Code Not Recognized</h3>
              <p className="text-gray-500 mb-6">Reason: {errorType}</p>
              
              <div className="w-full space-y-3">
                <button onClick={resetScan} className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Retry Scan
                </button>
                <button className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                  <Search className="w-5 h-5 mr-2" />
                  Manual Search
                </button>
                <button onClick={resetScan} className="w-full py-3 px-4 text-gray-500 font-medium hover:text-gray-700">
                  Return to Scanner
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
