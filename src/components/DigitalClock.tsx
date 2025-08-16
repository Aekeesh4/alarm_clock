import React from 'react';
import { Globe } from 'lucide-react';
import { AppSettings } from '../types';

interface DigitalClockProps {
  currentTime: Date;
  settings: AppSettings;
}

const DigitalClock: React.FC<DigitalClockProps> = ({ currentTime, settings }) => {
  const formatTime = (time: Date, is24Hour: boolean) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    if (is24Hour) {
      return {
        time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        seconds: seconds.toString().padStart(2, '0'),
        period: ''
      };
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return {
        time: `${displayHours}:${minutes.toString().padStart(2, '0')}`,
        seconds: seconds.toString().padStart(2, '0'),
        period
      };
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeZones = () => {
    const now = new Date();
    return [
      {
        city: 'New York',
        time: new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
      },
      {
        city: 'London',
        time: new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }))
      },
      {
        city: 'Tokyo',
        time: new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
      }
    ];
  };

  const { time, seconds, period } = formatTime(currentTime, settings.is24Hour);
  const timeZones = getTimeZones();

  return (
    <div className={`rounded-2xl p-8 mb-8 ${
      settings.darkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl border border-gray-700' 
        : 'bg-white shadow-2xl'
    }`}>
      {/* Main Clock Display */}
      <div className="text-center mb-8">
        <div className={`text-7xl md:text-8xl font-mono font-bold mb-2 ${
          settings.darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          <span className="tabular-nums">{time}</span>
          <span className={`text-3xl md:text-4xl ml-2 ${
            settings.darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {seconds}
          </span>
          {period && (
            <span className={`text-3xl md:text-4xl ml-4 ${
              settings.darkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {period}
            </span>
          )}
        </div>
        <p className={`text-xl ${
          settings.darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {formatDate(currentTime)}
        </p>
      </div>

      {/* World Clock */}
      <div className="border-t pt-6">
        <div className={`flex items-center gap-2 mb-4 ${
          settings.darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <Globe size={20} />
          <span className="font-medium">World Clock</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {timeZones.map(({ city, time: zoneTime }) => {
            const { time: displayTime, period: zonePeriod } = formatTime(zoneTime, settings.is24Hour);
            return (
              <div key={city} className={`text-center p-4 rounded-xl ${
                settings.darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className={`text-2xl font-mono font-semibold ${
                  settings.darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {displayTime}
                  {zonePeriod && (
                    <span className={`text-sm ml-1 ${
                      settings.darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {zonePeriod}
                    </span>
                  )}
                </div>
                <div className={`text-sm ${
                  settings.darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {city}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;