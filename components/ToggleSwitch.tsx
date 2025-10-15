import React from 'react';

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange, children }) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only" // Hide default checkbox
          checked={checked}
          onChange={onChange}
        />
        {/* Track */}
        <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ${checked ? 'bg-amber-500' : 'bg-slate-600 group-hover:bg-slate-500'}`}></div>
        {/* Thumb */}
        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </div>
      <div className="ml-4 text-slate-200 font-medium">
        {children}
      </div>
    </label>
  );
};
