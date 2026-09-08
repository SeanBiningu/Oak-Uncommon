import React from 'react';
import { Download, Save, Calendar, MapPin, User, Building } from 'lucide-react';

const QRCodePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Your Entry Pass</h2>
          <p className="mt-2 text-sm text-gray-600">Present this QR code during event entry</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 flex flex-col items-center">
            {/* Participant Info */}
            <div className="w-full space-y-3 mb-6">
              <div className="flex items-center text-gray-700">
                <User className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium">Jane Doe</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Building className="h-5 w-5 mr-3 text-gray-400" />
                <span>Global Health Initiative</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Registration ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">OAK-2026-8492</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg border-2 border-gray-100 shadow-sm mb-6">
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded">
                <span className="text-gray-400 font-medium">[QR Code Generated]</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 w-full">
              <button className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Download className="h-4 w-4 mr-2" />
                PNG
              </button>
              <button className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Save className="h-4 w-4 mr-2" />
                Save to Device
              </button>
            </div>
          </div>

          {/* Event Info Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Event Details</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="font-medium text-gray-900 w-24">Event:</div>
                <div className="flex-1">OAK Foundation Event</div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-4 w-4 mt-0.5 mr-2 text-gray-400" />
                <div className="flex-1">9 Nov 2026 - 11 Nov 2026</div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mt-0.5 mr-2 text-gray-400" />
                <div className="flex-1">Main Conference Center, TBA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
