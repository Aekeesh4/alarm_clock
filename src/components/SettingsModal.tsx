import React, { useState } from 'react';
import { X, Clock, Moon, Sun, Volume2, Timer } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-2xl p-6 w-full max-w-md ${
        localSettings.darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${
            localSettings.darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Settings
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              localSettings.darkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Time Format */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={20} className={localSettings.darkMode ? 'text-gray-300' : 'text-gray-600'} />
              <div>
                <div className={`font-medium ${
                  localSettings.darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  24-Hour Format
                </div>
                <div className={`text-sm ${
                  localSettings.darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Use 24-hour time display
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.is24Hour}
                onChange={(e) => updateSetting('is24Hour', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {localSettings.darkMode ? (
                <Moon size={20} className="text-gray-300" />
              ) : (
                <Sun size={20} className="text-gray-600" />
              )}
              <div>
                <div className={`font-medium ${
                  localSettings.darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Dark Mode
                </div>
                <div className={`text-sm ${
                  localSettings.darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Use dark theme
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.darkMode}
                onChange={(e) => updateSetting('darkMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Snooze Interval */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Timer size={20} className={localSettings.darkMode ? 'text-gray-300' : 'text-gray-600'} />
              <div>
                <div className={`font-medium ${
                  localSettings.darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Snooze Interval
                </div>
                <div className={`text-sm ${
                  localSettings.darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Minutes between snoozes
                </div>
              </div>
            </div>
            <select
              value={localSettings.snoozeInterval}
              onChange={(e) => updateSetting('snoozeInterval', parseInt(e.target.value))}
              className={`w-full px-4 py-2 rounded-lg border ${
                localSettings.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value={1}>1 minute</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
            </select>
          </div>

          {/* Alarm Volume */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Volume2 size={20} className={localSettings.darkMode ? 'text-gray-300' : 'text-gray-600'} />
              <div className="flex-1">
                <div className={`font-medium ${
                  localSettings.darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Alarm Volume
                </div>
                <div className={`text-sm ${
                  localSettings.darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {Math.round(localSettings.alarmVolume * 100)}%
                </div>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localSettings.alarmVolume}
              onChange={(e) => updateSetting('alarmVolume', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Default Tone */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Volume2 size={20} className={localSettings.darkMode ? 'text-gray-300' : 'text-gray-600'} />
              <div>
                <div className={`font-medium ${
                  localSettings.darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Default Alarm Tone
                </div>
                <div className={`text-sm ${
                  localSettings.darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Default sound for new alarms
                </div>
              </div>
            </div>
            <select
              value={localSettings.defaultTone}
              onChange={(e) => updateSetting('defaultTone', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                localSettings.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="beep">Beep</option>
              <option value="bell">Bell</option>
              <option value="chime">Chime</option>
              <option value="classic">Classic</option>
              <option value="digital">Digital</option>
              <option value="gentle">Gentle</option>
              <option value="horn">Horn</option>
              <option value="piano">Piano</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-lg transition-colors ${
              localSettings.darkMode
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
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;