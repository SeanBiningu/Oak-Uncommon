import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, Edit3, X, Save } from 'lucide-react';

const schedule = [
  {
    id: 1,
    date: '9 Nov 2026',
    time: '09:00 AM - 10:30 AM',
    title: 'Opening Keynote: The Future of Global Health',
    speaker: 'Dr. Sarah Jenkins',
    venue: 'Main Auditorium',
    description: 'A comprehensive overview of upcoming challenges and opportunities in the global health sector over the next decade.',
  },
  {
    id: 2,
    date: '9 Nov 2026',
    time: '11:00 AM - 12:30 PM',
    title: 'Panel: Funding Innovations',
    speaker: 'Multiple Speakers',
    venue: 'Hall B',
    description: 'Exploring new mechanisms for funding grassroots initiatives effectively.',
  }
];

const ProgramPage = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [notes, setNotes] = useState({});
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState('');

  const openSession = (session) => {
    setSelectedSession(session);
    setTempNote(notes[session.id] || '');
    setIsEditingNote(false);
  };

  const saveNote = () => {
    setNotes({ ...notes, [selectedSession.id]: tempNote });
    setIsEditingNote(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Schedule List */}
      <div className={`w-full ${selectedSession ? 'hidden md:block md:w-1/2 lg:w-1/3' : 'w-full'} border-r border-gray-200 bg-white h-screen overflow-y-auto`}>
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h1 className="text-2xl font-bold text-gray-900">Event Program</h1>
          <p className="text-sm text-gray-500 mt-1">9 Nov 2026 - 11 Nov 2026</p>
        </div>
        
        <div className="p-4 space-y-4">
          {schedule.map((session) => (
            <div 
              key={session.id} 
              onClick={() => openSession(session)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${selectedSession?.id === session.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
            >
              <div className="flex items-center text-xs font-medium text-blue-600 mb-2">
                <CalendarIcon className="w-3 h-3 mr-1" /> {session.date}
                <Clock className="w-3 h-3 ml-3 mr-1" /> {session.time}
              </div>
              <h3 className="font-bold text-gray-900">{session.title}</h3>
              <div className="mt-2 text-sm text-gray-600 flex flex-col space-y-1">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" /> {session.speaker}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" /> {session.venue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Details Pane */}
      {selectedSession ? (
        <div className="w-full md:w-1/2 lg:w-2/3 bg-gray-50 h-screen overflow-y-auto flex flex-col">
          <div className="p-6 md:p-10 max-w-4xl w-full mx-auto">
            <button 
              onClick={() => setSelectedSession(null)}
              className="md:hidden flex items-center text-blue-600 font-medium mb-6"
            >
              &larr; Back to Schedule
            </button>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedSession.title}</h2>
              
              <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700 bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center"><CalendarIcon className="w-5 h-5 mr-2 text-blue-500" /> {selectedSession.date}</div>
                <div className="flex items-center"><Clock className="w-5 h-5 mr-2 text-blue-500" /> {selectedSession.time}</div>
                <div className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-blue-500" /> {selectedSession.venue}</div>
                <div className="flex items-center"><User className="w-5 h-5 mr-2 text-blue-500" /> {selectedSession.speaker}</div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Session Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {selectedSession.description}
              </p>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Edit3 className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Notes
                </h3>
                {!isEditingNote ? (
                  <button onClick={() => setIsEditingNote(true)} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    {notes[selectedSession.id] ? 'Edit Notes' : 'Create Notes'}
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button onClick={() => setIsEditingNote(false)} className="p-2 text-gray-500 hover:text-gray-700">
                      <X className="w-5 h-5" />
                    </button>
                    <button onClick={saveNote} className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-1" /> Save
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6">
                {isEditingNote ? (
                  <textarea
                    className="w-full h-48 p-4 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your notes here..."
                    value={tempNote}
                    onChange={(e) => setTempNote(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <div className="min-h-[120px] text-gray-700 whitespace-pre-wrap">
                    {notes[selectedSession.id] || <span className="text-gray-400 italic">No notes saved for this session.</span>}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="hidden md:flex w-1/2 lg:w-2/3 bg-gray-50 items-center justify-center h-screen text-gray-400 flex-col">
          <CalendarIcon className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-lg font-medium">Select a session to view details</p>
        </div>
      )}
    </div>
  );
};

export default ProgramPage;
