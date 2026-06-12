'use client';

import { useState, useEffect } from 'react';
import { Plus, Home, Settings } from 'lucide-react';

interface NavbarProps {
  projectName: string;
  onAddExpense: () => void;
  onSettings: () => void;
}

export function Navbar({
  projectName,
  onAddExpense,
  onSettings,
}: NavbarProps) {
  const [timeString, setTimeString] = useState<string>('');
  const [shortTimeString, setShortTimeString] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      
      const fullFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      const fullParts = fullFormatter.formatToParts(now);
      const day = fullParts.find(p => p.type === 'day')?.value || '';
      const month = fullParts.find(p => p.type === 'month')?.value || '';
      const year = fullParts.find(p => p.type === 'year')?.value || '';
      const hour = fullParts.find(p => p.type === 'hour')?.value || '';
      const minute = fullParts.find(p => p.type === 'minute')?.value || '';
      const second = fullParts.find(p => p.type === 'second')?.value || '';
      const dayPeriod = fullParts.find(p => p.type === 'dayPeriod')?.value?.toUpperCase() || '';
      
      setTimeString(`${day}-${month}-${year} ${hour}:${minute}:${second} ${dayPeriod}`);

      const shortFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const shortParts = shortFormatter.formatToParts(now);
      const sHour = shortParts.find(p => p.type === 'hour')?.value || '';
      const sMinute = shortParts.find(p => p.type === 'minute')?.value || '';
      const sDayPeriod = shortParts.find(p => p.type === 'dayPeriod')?.value?.toUpperCase() || '';
      setShortTimeString(`${sHour}:${sMinute} ${sDayPeriod}`);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 h-16 bg-white border-b border-gray-100">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <Home className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-none">
          {projectName}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {timeString && (
          <div className="text-[11px] sm:text-xs text-gray-500 font-mono bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 sm:px-3 sm:py-1.5 select-none transition-all duration-200">
            <span className="sm:hidden">{shortTimeString}</span>
            <span className="hidden sm:inline">{timeString}</span>
          </div>
        )}
        <button
          onClick={onSettings}
          className="flex items-center gap-1.5 text-xs text-gray-600 px-2 py-1.5 sm:px-3 sm:py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Settings</span>
        </button>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-md hover:bg-gray-800 transition-colors"
          title="Add Expense"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Expense</span>
        </button>
      </div>
    </header>
  );
}
