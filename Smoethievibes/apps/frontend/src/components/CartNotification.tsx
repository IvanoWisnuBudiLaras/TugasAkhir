// components/CartNotification.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

interface CartNotificationProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export function CartNotification({ message, duration = 3000, onClose }: CartNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
        <div className="flex-shrink-0">
          <Check className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 hover:bg-green-600 rounded p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}