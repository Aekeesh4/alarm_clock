import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Flag } from 'lucide-react';
import { AppSettings } from '../types';

interface Lap {
  id: number;
  time: number;
  lapTime: number;
}

interface StopwatchComponentProps {
  settings: AppSettings;
}

const StopwatchComponent: React.FC<StopwatchComponentProps> = ({ settings }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => time + 10);
      }, 10);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  
  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setLastLapTime(0);
  };

  const addLap = () => {
    const lapTime = time - lastLapTime;
    const newLap: Lap = {
      id: laps.length + 1,
      time,
      lapTime
    };
    setLaps(prev => [newLap, ...prev]);
    setLastLapTime(time);
  };

  const getBestLap = () => {
    if (laps.length === 0) return null;
    return laps.reduce((best, lap) => lap.lapTime < best.lapTime ? lap : best);
  };

  const getWorstLap = () => {
    if (laps.length === 0) return null;
    return laps.reduce((worst, lap) => lap.lapTime > worst.lapTime ? lap : worst);
  };

  const bestLap = getBestLap();
  const worstLap = getWorstLap();

  return (
    <div className={`rounded-2xl p-8 ${
      settings.darkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl border border-gray-700' 
        : 'bg-white shadow-2xl'
    }`}>
      <h2 className={`text-2xl font-semibold text-center mb-8 ${
        settings.darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Stopwatch
      </h2>

      {/* Stopwatch Display */}
      <div className="text-center mb-8">
        <div className={`text-8xl font-mono font-bold mb-6 ${
          settings.darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {formatTime(time)}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {!isRunning ? (
            <button
              onClick={start}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Play size={24} />
            </button>
          ) : (
            <button
              onClick={pause}
              className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Pause size={24} />
            </button>
          )}

          <button
            onClick={addLap}
            disabled={time === 0}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Flag size={24} />
          </button>

          <button
            onClick={reset}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Square size={24} />
          </button>
        </div>
      </div>

      {/* Lap Times */}
      {laps.length > 0 && (
        <div className={`rounded-xl p-4 ${
          settings.darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            settings.darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Lap Times
          </h3>
          
          <div className="max-h-64 overflow-y-auto space-y-2">
            {laps.map(lap => {
              const isBest = bestLap && lap.id === bestLap.id;
              const isWorst = worstLap && lap.id === worstLap.id && laps.length > 1;
              
              return (
                <div
                  key={lap.id}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    isBest
                      ? 'bg-green-100 border border-green-300'
                      : isWorst
                      ? 'bg-red-100 border border-red-300'
                      : settings.darkMode
                      ? 'bg-gray-600'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-medium ${
                      isBest
                        ? 'text-green-700'
                        : isWorst
                        ? 'text-red-700'
                        : settings.darkMode
                        ? 'text-gray-200'
                        : 'text-gray-600'
                    }`}>
                      Lap {lap.id}
                    </span>
                    {isBest && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Best</span>}
                    {isWorst && <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">Worst</span>}
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-mono font-semibold ${
                      isBest
                        ? 'text-green-700'
                        : isWorst
                        ? 'text-red-700'
                        : settings.darkMode
                        ? 'text-white'
                        : 'text-gray-800'
                    }`}>
                      {formatTime(lap.lapTime)}
                    </div>
                    <div className={`text-sm font-mono ${
                      settings.darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {formatTime(lap.time)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StopwatchComponent;