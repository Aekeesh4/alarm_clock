import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { AppSettings } from '../types';

interface TimerComponentProps {
  settings: AppSettings;
}

const TimerComponent: React.FC<TimerComponentProps> = ({ settings }) => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(minutes * 60 + seconds);
    }
    setIsRunning(true);
    setIsFinished(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsFinished(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTime = timeLeft > 0 ? formatTime(timeLeft) : formatTime(minutes * 60 + seconds);
  const progress = timeLeft > 0 ? (timeLeft / (minutes * 60 + seconds)) * 100 : 100;

  return (
    <div className={`rounded-2xl p-8 ${
      settings.darkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl border border-gray-700' 
        : 'bg-white shadow-2xl'
    }`}>
      <h2 className={`text-2xl font-semibold text-center mb-8 ${
        settings.darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Timer
      </h2>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className={`text-8xl font-mono font-bold mb-4 ${
          isFinished ? 'text-red-500 animate-pulse' : 
          settings.darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {displayTime}
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={settings.darkMode ? '#374151' : '#e5e7eb'}
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isFinished ? '#ef4444' : '#3b82f6'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={283 - (progress / 100) * 283}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-semibold ${
              settings.darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Timer Input */}
      {!isRunning && timeLeft === 0 && (
        <div className="flex justify-center gap-4 mb-8">
          <div className="text-center">
            <label className={`block text-sm font-medium mb-2 ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Minutes
            </label>
            <input
              type="number"
              min="0"
              max="99"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              className={`w-20 px-3 py-2 text-center rounded-lg border ${
                settings.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div className="text-center">
            <label className={`block text-sm font-medium mb-2 ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Seconds
            </label>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className={`w-20 px-3 py-2 text-center rounded-lg border ${
                settings.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            disabled={minutes === 0 && seconds === 0}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Play size={24} />
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Pause size={24} />
          </button>
        )}

        <button
          onClick={resetTimer}
          className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${
            settings.darkMode
              ? 'bg-gray-600 hover:bg-gray-500 text-white'
              : 'bg-gray-400 hover:bg-gray-500 text-white'
          }`}
        >
          <RotateCcw size={24} />
        </button>

        {isRunning && (
          <button
            onClick={resetTimer}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Square size={24} />
          </button>
        )}
      </div>

      {isFinished && (
        <div className={`text-center mt-6 p-4 rounded-lg ${
          settings.darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
        }`}>
          <p className="text-lg font-semibold">Time's up!</p>
          <p>Your timer has finished.</p>
        </div>
      )}
    </div>
  );
};

export default TimerComponent;