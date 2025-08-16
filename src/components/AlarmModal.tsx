import React, { useState, useEffect } from 'react';
import { X, Clock, Tag, Repeat, Volume2 } from 'lucide-react';
import { Alarm, AppSettings } from '../types';

interface AlarmModalProps {
  alarm: Alarm | null;
  settings: AppSettings;
  onSave: (alarmData: Omit<Alarm, 'id' | 'isRinging'>) => void;
  onClose: () => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({ alarm, settings, onSave, onClose }) => {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('Alarm');
  const [recurring, setRecurring] = useState<Alarm['recurring']>('none');
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const [tone, setTone] = useState('beep');
  const [enabled, setEnabled] = useState(true);

  const tones = [
    'beep', 'bell', 'chime', 'classic', 'digital', 'gentle', 'horn', 'piano'
  ];

  const days = [
    { id: 0, label: 'Sun' },
    { id: 1, label: 'Mon' },
    { id: 2, label: 'Tue' },
    { id: 3, label: 'Wed' },
    { id: 4, label: 'Thu' },
    { id: 5, label: 'Fri' },
    { id: 6, label: 'Sat' }
  ];

  useEffect(() => {
    if (alarm) {
      setTime(alarm.time);
      setLabel(alarm.label);
      setRecurring(alarm.recurring);
      setRecurringDays(alarm.recurringDays || []);
      setTone(alarm.tone);
      setEnabled(alarm.enabled);
    }
  }, [alarm]);

  const handleSave = () => {
    onSave({
      time,
      label,
      enabled,
      recurring,
      recurringDays: recurring === 'custom' ? recurringDays : undefined,
      tone
    });
  };

  const toggleDay = (dayId: number) => {
    setRecurringDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId].sort()
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-2xl p-6 w-full max-w-md ${
        settings.darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${
            settings.darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {alarm ? 'Edit Alarm' : 'New Alarm'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              settings.darkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Time Input */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Clock size={16} />
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg text-lg font-mono border transition-colors ${
                settings.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
            />
          </div>

          {/* Label Input */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Tag size={16} />
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                settings.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              placeholder="Enter alarm label"
            />
          </div>

          {/* Recurring Options */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Repeat size={16} />
              Repeat
            </label>
            <select
              value={recurring}
              onChange={(e) => setRecurring(e.target.value as Alarm['recurring'])}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                settings.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
            >
              <option value="none">Once</option>
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Custom Days Selection */}
          {recurring === 'custom' && (
            <div>
              <label className={`text-sm font-medium mb-2 block ${
                settings.darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Select Days
              </label>
              <div className="flex gap-1">
                {days.map(day => (
                  <button
                    key={day.id}
                    onClick={() => toggleDay(day.id)}
                    className={`flex-1 py-2 px-1 text-xs font-medium rounded-lg transition-colors ${
                      recurringDays.includes(day.id)
                        ? 'bg-blue-500 text-white'
                        : settings.darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tone Selection */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Volume2 size={16} />
              Alarm Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                settings.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
            >
              {tones.map(toneOption => (
                <option key={toneOption} value={toneOption}>
                  {toneOption.charAt(0).toUpperCase() + toneOption.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Enable Toggle */}
          <div className="flex items-center justify-between">
            <label className={`text-sm font-medium ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Enable Alarm
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-lg transition-colors ${
              settings.darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-200"
          >
            Save Alarm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;