import { useState, useCallback, useEffect } from 'react';

interface NotificationState {
  isVisible: boolean;
  isClosing: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

interface ShowNotificationOptions {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Enhanced sound effect for notifications with reverb and delay
const playNotificationSound = (type: 'success' | 'error' | 'warning' | 'info') => {
  if (typeof window === 'undefined') return;
  
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    
    const playNote = (frequency: number, duration: number, delay: number = 0, stereo: number = 0, oscillatorType: OscillatorType = 'sine') => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const pannerNode = audioContext.createStereoPanner();
        const filterNode = audioContext.createBiquadFilter();
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(pannerNode);
        pannerNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = oscillatorType;
        pannerNode.pan.setValueAtTime(stereo, audioContext.currentTime);
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(frequency * 2, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      }, delay);
    };
    
    const playNoteWithDelay = (frequency: number, duration: number, delay: number): void => {
      // Main note
      playNote(frequency, duration, delay, 0, 'sine');
      // Echo note dengan filter
      playNote(frequency * 0.8, duration * 0.7, delay + duration + 0.1, 0.3, 'triangle');
      // Second echo dengan filter lebih rendah
      playNote(frequency * 0.6, duration * 0.5, delay + duration + 0.3, -0.3, 'square');
      // Reverb-like effect
      playNote(frequency * 1.5, duration * 0.3, delay + duration + 0.5, 0.2, 'sine');
      playNote(frequency * 2, duration * 0.2, delay + duration + 0.7, -0.2, 'triangle');
    };
    
    // Different melodies for different notification types dengan efek lebih kaya
    switch (type) {
      case 'success':
        playNoteWithDelay(523.25, 0.3, 0); // C5
        playNoteWithDelay(659.25, 0.3, 0.15); // E5
        playNoteWithDelay(783.99, 0.4, 0.3); // G5
        playNoteWithDelay(1046.50, 0.2, 0.5); // C6 (octave up)
        break;
      case 'error':
        playNoteWithDelay(440, 0.4, 0); // A4
        playNoteWithDelay(415.30, 0.3, 0.15); // G#4
        playNoteWithDelay(392, 0.5, 0.3); // G4
        playNoteWithDelay(369.99, 0.3, 0.5); // F#4
        break;
      case 'warning':
        playNoteWithDelay(523.25, 0.3, 0); // C5
        playNoteWithDelay(493.88, 0.3, 0.15); // B4
        playNoteWithDelay(523.25, 0.3, 0.3); // C5
        playNoteWithDelay(466.16, 0.2, 0.45); // Bb4
        break;
      case 'info':
        playNoteWithDelay(523.25, 0.2, 0); // C5
        playNoteWithDelay(622.25, 0.2, 0.1); // D#5
        playNoteWithDelay(698.46, 0.3, 0.2); // F5
        playNoteWithDelay(830.61, 0.2, 0.35); // G#5
        break;
    }
  } catch {
    // Silent fail untuk browser yang tidak support Web Audio API
    console.log('Sound effect not supported');
  }
};

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    isClosing: false,
    title: '',
    message: '',
    type: 'info',
    duration: 5000
  });

  const showNotification = useCallback((options: ShowNotificationOptions) => {
    // Mainkan sound effect
    playNotificationSound(options.type || 'info');
    
    setNotification({
      isVisible: true,
      isClosing: false,
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 5000
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isClosing: true
    }));

    // Tunggu animasi selesai sebelum menyembunyikan sepenuhnya
    setTimeout(() => {
      setNotification(prev => ({
        ...prev,
        isVisible: false,
        isClosing: false
      }));
    }, 300);
  }, []);

  useEffect(() => {
    if (notification.isVisible && notification.duration > 0 && !notification.isClosing) {
      const timer = setTimeout(() => {
        hideNotification();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.isVisible, notification.duration, notification.isClosing, hideNotification]);

  return {
    notification,
    showNotification,
    hideNotification
  };
};