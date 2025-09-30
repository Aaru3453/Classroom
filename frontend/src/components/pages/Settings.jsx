import React, { useState } from 'react';

const Settings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoSave: true,
    theme: 'light',
    language: 'english'
  });

  const handleToggle = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleThemeChange = (theme) => {
    setSettings({
      ...settings,
      theme
    });
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
    onClose();
  };

  return (
    <div className="p-6">
        <div className="pt-24 text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
               System Settings
            </h1>
        </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">General Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email alerts for schedule changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Auto-save</p>
                <p className="text-sm text-gray-600">Automatically save changes every 5 minutes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.autoSave}
                  onChange={() => handleToggle('autoSave')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Appearance</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { value: 'light', label: 'Light Mode', active: settings.theme === 'light' },
              { value: 'dark', label: 'Dark Mode', active: settings.theme === 'dark' },
              { value: 'auto', label: 'Auto', active: settings.theme === 'auto' }
            ].map((theme) => (
              <button 
                key={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  theme.active 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                <span className="font-medium">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Language</h3>
          <select 
            value={settings.language}
            onChange={(e) => setSettings({...settings, language: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;