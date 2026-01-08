import { useState } from 'react';
import { X, ExternalLink, Calendar } from 'lucide-react';
import { Database } from '../lib/database.types';

type Notification = Database['public']['Tables']['notifications']['Row'];

interface NotificationPopupProps {
  notification: Notification;
  onClose: () => void;
  onGoTo: () => void;
  onSchedule: (date: Date) => void;
}

export function NotificationPopup({
  notification,
  onClose,
  onGoTo,
  onSchedule,
}: NotificationPopupProps) {
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const isType1 = notification.priority === 'critical' || notification.priority === 'high';

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      onSchedule(dateTime);
    }
  };

  if (showScheduler) {
    return (
      <div
        className={`fixed ${
          isType1
            ? 'inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
            : 'bottom-4 right-4 z-50'
        }`}
      >
        <div
          className={`bg-white rounded-lg shadow-2xl ${
            isType1 ? 'max-w-md w-full mx-4' : 'w-80'
          }`}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Schedule for later</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => setShowScheduler(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isType1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="text-3xl font-bold text-white">IMPORTANT</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            <p className="text-xl text-white font-medium">{notification.title}</p>
          </div>

          <div className="p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">{notification.message}</p>

            <div className="flex items-center gap-4">
              <button
                onClick={onGoTo}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <ExternalLink className="w-5 h-5" />
                Go To
              </button>
              <button
                onClick={() => setShowScheduler(true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <Calendar className="w-5 h-5" />
                Schedule
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-white rounded-lg shadow-2xl w-96 overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">{notification.title}</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-gray-700 text-sm mb-4">{notification.message}</p>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoTo}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Go To
            </button>
            <button
              onClick={() => setShowScheduler(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
