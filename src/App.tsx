import React, { useState, useEffect } from 'react';
import { Clock, Plus, Settings, Timer, Watch as Stopwatch } from 'lucide-react';
import DigitalClock from './components/DigitalClock';
import AlarmList from './components/AlarmList';
import AlarmModal from './components/AlarmModal';
import TimerComponent from './components/TimerComponent';
import StopwatchComponent from './components/StopwatchComponent';
import SettingsModal from './components/SettingsModal';
import { Alarm, AppSettings, Tab } from './types';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('clock');
  const [settings, setSettings] = useState<AppSettings>({
    is24Hour: false,
    darkMode: false,
    snoozeInterval: 5,
    alarmVolume: 0.7,
    defaultTone: 'beep'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check for active alarms
    const now = new Date();
    alarms.forEach(alarm => {
      if (alarm.enabled && !alarm.isRinging) {
        const alarmTime = new Date();
        const [hours, minutes] = alarm.time.split(':').map(Number);
        alarmTime.setHours(hours, minutes, 0, 0);

        if (Math.abs(now.getTime() - alarmTime.getTime()) < 30000) { // Within 30 seconds
          triggerAlarm(alarm.id);
        }
      }
    });
  }, [currentTime, alarms]);

  const addAlarm = (alarmData: Omit<Alarm, 'id' | 'isRinging'>) => {
    const newAlarm: Alarm = {
      ...alarmData,
      id: Date.now().toString(),
      isRinging: false
    };
    setAlarms(prev => [...prev, newAlarm]);
  };

  const updateAlarm = (id: string, updates: Partial<Alarm>) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, ...updates } : alarm
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const triggerAlarm = (id: string) => {
    updateAlarm(id, { isRinging: true });
    // In a real app, this would play the alarm sound
    console.log('Alarm triggered:', id);
  };

  const snoozeAlarm = (id: string) => {
    updateAlarm(id, { isRinging: false });
    // In a real app, this would set a new alarm for snooze interval later
    console.log('Alarm snoozed:', id);
  };

  const stopAlarm = (id: string) => {
    updateAlarm(id, { isRinging: false });
    console.log('Alarm stopped:', id);
  };

  const tabs = [
    { id: 'clock' as Tab, label: 'Clock', icon: Clock },
    { id: 'timer' as Tab, label: 'Timer', icon: Timer },
    { id: 'stopwatch' as Tab, label: 'Stopwatch', icon: Stopwatch }
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      settings.darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${
            settings.darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Advanced Alarm Clock
          </h1>
          <p className={`text-lg ${
            settings.darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your complete time management solution
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className={`flex rounded-xl p-1 ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? settings.darkMode
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : settings.darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'clock' && (
            <>
              <DigitalClock 
                currentTime={currentTime} 
                settings={settings}
              />
              
              <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-semibold ${
                  settings.darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Your Alarms
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className={`p-3 rounded-full transition-all duration-200 ${
                      settings.darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-white hover:bg-gray-50 text-gray-600 shadow-md'
                    }`}
                  >
                    <Settings size={20} />
                  </button>
                  <button
                    onClick={() => setShowAlarmModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <AlarmList 
                alarms={alarms}
                settings={settings}
                onEdit={(alarm) => {
                  setEditingAlarm(alarm);
                  setShowAlarmModal(true);
                }}
                onDelete={deleteAlarm}
                onToggle={(id, enabled) => updateAlarm(id, { enabled })}
                onSnooze={snoozeAlarm}
                onStop={stopAlarm}
              />
            </>
          )}

          {activeTab === 'timer' && (
            <TimerComponent settings={settings} />
          )}

          {activeTab === 'stopwatch' && (
            <StopwatchComponent settings={settings} />
          )}
        </div>
      </div>

      {/* Modals */}
      {showAlarmModal && (
        <AlarmModal
          alarm={editingAlarm}
          settings={settings}
          onSave={(alarmData) => {
            if (editingAlarm) {
              updateAlarm(editingAlarm.id, alarmData);
            } else {
              addAlarm(alarmData);
            }
            setShowAlarmModal(false);
            setEditingAlarm(null);
          }}
          onClose={() => {
            setShowAlarmModal(false);
            setEditingAlarm(null);
          }}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onSave={setSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}

export default App;