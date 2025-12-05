"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, Info, AlertCircle } from 'lucide-react';
import ParticleEffect from './ParticleEffect';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  isClosing?: boolean;
}

const Notification: React.FC<NotificationProps> = ({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose,
  isClosing = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [startTime] = useState(Date.now());
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        setProgress((remaining / duration) * 100);
        if (remaining === 0) {
          setIsVisible(false);
          onClose?.();
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [duration, onClose, startTime]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  // Removed unused color helper functions for cleaner code

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300 shadow-green-200';
      case 'error':
        return 'bg-gradient-to-br from-red-50 to-rose-100 border-red-300 shadow-red-200';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-300 shadow-yellow-200';
      default:
        return 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-300 shadow-blue-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`min-w-[320px] max-w-[400px] p-6 rounded-2xl shadow-2xl backdrop-blur-2xl bg-opacity-95 transform transition-all duration-300 hover:rotate-1 hover:scale-105 hover:shadow-3xl ${
          isClosing ? 'animate-slide-out' : 'animate-slide-in'
        } ${getBackgroundColor()} group relative overflow-hidden animate-float`}
        style={{
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.05) 100%),
            ${type === 'success' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' :
              type === 'error' ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)' :
              type === 'warning' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)' :
              'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)'}
          `,
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 50px ${type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 
                     type === 'error' ? 'rgba(239, 68, 68, 0.4)' :
                     type === 'warning' ? 'rgba(245, 158, 11, 0.4)' : 
                     'rgba(59, 130, 246, 0.4)'}
          `,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(20px) saturate(180%)'
        }}
      >
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-10 rounded-2xl" />
        
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
             style={{
               background: `linear-gradient(45deg, transparent, ${type === 'success' ? '#10B981' : 
                           type === 'error' ? '#EF4444' :
                           type === 'warning' ? '#F59E0B' : 
                           '#3B82F6'}, transparent)`,
               filter: 'blur(2px)'
             }}
        />
        
        {/* Animated shimmer effect dengan efek lebih menarik */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-25 transition-opacity duration-500 animate-shimmer pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-0 group-hover:opacity-15 transition-opacity duration-500 animate-shimmer pointer-events-none" style={{ animationDelay: '0.5s' }} />
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 animate-shimmer pointer-events-none" style={{ animationDelay: '1s' }} />
        
        {/* Enhanced glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-pulse pointer-events-none" style={{
          background: `radial-gradient(circle at center, ${type === 'success' ? 'rgba(16, 185, 129, 0.3)' : type === 'error' ? 'rgba(239, 68, 68, 0.3)' : type === 'warning' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'} 0%, transparent 70%)`
        }} />
        
        {/* Particle effect */}
        <ParticleEffect isActive={!isClosing} type={type} />
        
        {/* Progress bar dengan efek shimmer */}
        <div className="h-2 bg-black bg-opacity-20 rounded-b-2xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
            style={{
              width: `${progress}%`,
              boxShadow: `
                0 0 20px rgba(255,255,255,0.8),
                inset 0 0 10px rgba(255,255,255,0.5)
              `,
              filter: 'blur(0.5px)'
            }}
          >
            {/* Shimmer effect pada progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer" 
                 style={{ animationDelay: '0.5s' }} />
          </div>
          
          {/* Inner glow pada progress bar container */}
          <div className="absolute inset-0 rounded-b-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-shimmer" />
        </div>

        <div className="flex items-start space-x-4 relative z-10">
          {/* Icon container dengan efek cahaya yang lebih menarik */}
          <div className="flex-shrink-0 relative">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-2 border-white border-opacity-50 animate-pulse backdrop-blur-sm relative overflow-hidden"
                 style={{
                   background: `
                     linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%),
                     ${type === 'success' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)' :
                       type === 'error' ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)' :
                       type === 'warning' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)' :
                       'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)'}
                   `
                 }}>
              {/* Inner glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white to-transparent opacity-20" />
              
              <div className="animate-bounce relative z-10">
                {getIcon()}
              </div>
              
              {/* Rotating light effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-spin" 
                   style={{ animationDuration: '3s' }} />
            </div>
            
            {/* Multiple glow effects */}
            <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{
              backgroundColor: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#3B82F6'
            }} />
            <div className="absolute -inset-2 rounded-full animate-pulse opacity-20" style={{
              backgroundColor: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#3B82F6',
              filter: 'blur(8px)'
            }} />
            <div className="absolute -inset-4 rounded-full animate-ping opacity-10" style={{
              backgroundColor: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#3B82F6',
              filter: 'blur(12px)',
              animationDelay: '1s'
            }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-2 leading-tight tracking-wide drop-shadow-2xl">
              {title}
            </h3>
            <p className="text-sm text-white text-opacity-95 leading-relaxed drop-shadow-lg font-medium">
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 backdrop-blur-sm shadow-xl"
          >
            <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corner decorations dengan efek cahaya */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-10 rounded-full backdrop-blur-sm animate-pulse" />
        <div className="absolute bottom-2 left-2 w-6 h-6 bg-white bg-opacity-10 rounded-full backdrop-blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-2 left-2 w-4 h-4 bg-white bg-opacity-10 rounded-full backdrop-blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-2 right-2 w-10 h-10 bg-white bg-opacity-10 rounded-full backdrop-blur-sm animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {/* Side decorations dengan efek shimmer */}
        <div className="absolute top-1/2 -left-1 w-2 h-16 bg-white bg-opacity-20 rounded-full backdrop-blur-sm transform -translate-y-1/2 animate-shimmer" />
        <div className="absolute top-1/2 -right-1 w-2 h-12 bg-white bg-opacity-20 rounded-full backdrop-blur-sm transform -translate-y-1/2 animate-shimmer" style={{ animationDelay: '0.3s' }} />
        
        {/* Top and bottom decorations dengan efek cahaya */}
        <div className="absolute -top-1 left-1/2 w-16 h-2 bg-white bg-opacity-20 rounded-full backdrop-blur-sm transform -translate-x-1/2 animate-shimmer" />
        <div className="absolute -bottom-1 left-1/2 w-12 h-2 bg-white bg-opacity-20 rounded-full backdrop-blur-sm transform -translate-x-1/2 animate-shimmer" style={{ animationDelay: '0.6s' }} />
        
        {/* Additional floating light effects */}
        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-white bg-opacity-30 rounded-full backdrop-blur-sm animate-ping" style={{ animationDelay: '0.2s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-white bg-opacity-30 rounded-full backdrop-blur-sm animate-ping" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-3/4 left-1/4 w-4 h-4 bg-white bg-opacity-20 rounded-full backdrop-blur-sm animate-pulse" style={{ animationDelay: '1.2s' }} />
      </div>
      
      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Notification;