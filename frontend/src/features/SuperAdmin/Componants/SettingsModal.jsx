import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../cricket/UI/dialog.jsx';
import { Button } from '../../cricket/UI/button.jsx';

export default function SettingsModal({ open, onOpenChange }) {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSync: false,
    darkMode: true,
    twoFA: true,
    sessionTimeout: true,
    emailAlerts: true,
    maintenanceMode: false
  });

  const handleSettingChange = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Optionally persist settings here
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-white border bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">System Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">General Settings</h3>
            <div className="pl-4 space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600" checked={settings.notifications} onChange={() => handleSettingChange('notifications')} />
                <span className="text-sm text-slate-300">Enable notifications</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600" checked={settings.autoSync} onChange={() => handleSettingChange('autoSync')} />
                <span className="text-sm text-slate-300">Auto-sync data</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600" checked={settings.darkMode} onChange={() => handleSettingChange('darkMode')} />
                <span className="text-sm text-slate-300">Enable dark mode</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600" checked={settings.emailAlerts} onChange={() => handleSettingChange('emailAlerts')} />
                <span className="text-sm text-slate-300">Email alerts</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">Security Settings</h3>
            <div className="pl-4 space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600" checked={settings.twoFA} onChange={() => handleSettingChange('twoFA')} />
                <span className="text-sm text-slate-300">Require 2FA</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600" checked={settings.sessionTimeout} onChange={() => handleSettingChange('sessionTimeout')} />
                <span className="text-sm text-slate-300">Session timeout</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">System Settings</h3>
            <div className="pl-4 space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600" checked={settings.maintenanceMode} onChange={() => handleSettingChange('maintenanceMode')} />
                <span className="text-sm text-slate-300">Maintenance mode</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1 text-white bg-blue-600 hover:bg-blue-700">Save & Close</Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
