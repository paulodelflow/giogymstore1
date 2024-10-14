import React from 'react';
import { useState } from 'react';

export const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div onClick={toggleDropdown} className="cursor-pointer">
        {children[0]} {/* Trigger button */}
      </div>
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-full md:w-48 bg-white rounded-md shadow-lg z-10 
            max-h-[50vh] md:max-h-full overflow-hidden transform transition-all duration-300 
            ${isOpen ? 'translate-y-0' : 'translate-y-full'} origin-bottom md:origin-top`}
        >
          {children[1]} {/* Dropdown content */}
        </div>
      )}
    </div>
  );
};

export const DropdownMenuTrigger = ({ asChild, children }) => {
  return <>{children}</>;
};

export const DropdownMenuContent = ({ children, align = "start" }) => {
  return (
    <div className={`p-2 bg-white shadow-md rounded-lg w-full md:w-48 ${align === "end" ? "right-0" : ""}`}>
      {children}
    </div>
  );
};

export const DropdownMenuLabel = ({ children }) => {
  return <div className="px-4 py-2 text-sm font-medium text-gray-700">{children}</div>;
};

export const DropdownMenuItem = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
    >
      {children}
    </div>
  );
};

export const DropdownMenuSeparator = () => {
  return <div className="border-t border-gray-200 my-1"></div>;
};
