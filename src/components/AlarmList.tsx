import React from 'react';
import { Edit2, Trash2, Bell, BellRing, SunSnow as Snooze, Square } from 'lucide-react';
import { Alarm, AppSettings } from '../types';

interface AlarmListProps {
  alarms: Alarm[];
  settings: AppSettings;
  onEdit: (alarm: Alarm) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
  onSnooze: (id: string) => void;
  onStop: (id: string) => void;
}

const AlarmList: React.FC<AlarmListProps> = ({
  alarms,
  settings,
  onEdit,
  onDelete,
  onToggle,
  onSnooze,
  onStop
}) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    if (settings.is24Hour) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  };

  const getRecurringText = (alarm: Alarm) => {
    switch (alarm.recurring) {
      case 'daily': return 'Daily';
      case 'weekdays': return 'Weekdays';
      case 'weekends': return 'Weekends';
      case 'custom': return 'Custom';
      default: return 'Once';
    }
  };

  if (alarms.length === 0) {
    return (
      <div className={`text-center py-12 rounded-2xl ${
        settings.darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
      }`}>
        <Bell className={`mx-auto mb-4 ${
          settings.darkMode ? 'text-gray-400' : 'text-gray-300'
        }`} size={48} />
        <p className={`text-lg ${
          settings.darkMode ? 'text-gray-300' : 'text-gray-500'
        }`}>
          No alarms set yet
        </p>
        <p className={`${
          settings.darkMode ? 'text-gray-400' : 'text-gray-400'
        }`}>
          Tap the + button to add your first alarm
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alarms.map(alarm => (
        <div key={alarm.id} className={`p-6 rounded-2xl transition-all duration-200 ${
          alarm.isRinging
            ? 'bg-red-100 border-2 border-red-300 animate-pulse'
            : settings.darkMode
            ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750'
            : 'bg-white shadow-lg hover:shadow-xl'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <div className={`text-3xl font-mono font-bold ${
                  alarm.enabled 
                    ? settings.darkMode ? 'text-white' : 'text-gray-800'
                    : settings.darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {formatTime(alarm.time)}
                </div>
                {alarm.isRinging && <BellRing className="text-red-500 animate-bounce" size={24} />}
              </div>
              
              <div className={`text-lg font-medium mb-1 ${
                alarm.enabled 
                  ? settings.darkMode ? 'text-gray-100' : 'text-gray-700'
                  : settings.darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {alarm.label}
              </div>
              
              <div className={`text-sm ${
                alarm.enabled 
                  ? settings.darkMode ? 'text-gray-300' : 'text-gray-500'
                  : settings.darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {getRecurringText(alarm)} • {alarm.tone}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {alarm.isRinging ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onSnooze(alarm.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg transition-all duration-200"
                  >
                    <Snooze size={18} />
                  </button>
                  <button
                    onClick={() => onStop(alarm.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-200"
                  >
                    <Square size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alarm.enabled}
                      onChange={(e) => onToggle(alarm.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  
                  <button
                    onClick={() => onEdit(alarm)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      settings.darkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Edit2 size={18} />
                  </button>
                  
                  <button
                    onClick={() => onDelete(alarm.id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      settings.darkMode
                        ? 'hover:bg-red-900 text-red-400'
                        : 'hover:bg-red-100 text-red-600'
                    }`}
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlarmList;