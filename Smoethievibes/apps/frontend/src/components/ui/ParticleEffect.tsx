import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
}

interface ParticleEffectProps {
  isActive: boolean;
  type?: 'success' | 'error' | 'warning' | 'info';
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ isActive, type = 'info' }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const getParticleColors = (type: string) => {
    switch (type) {
      case 'success':
        return ['#10B981', '#34D399', '#6EE7B7'];
      case 'error':
        return ['#EF4444', '#F87171', '#FCA5A5'];
      case 'warning':
        return ['#F59E0B', '#FCD34D', '#FDE68A'];
      case 'info':
        return ['#3B82F6', '#60A5FA', '#93C5FD'];
      default:
        return ['#ffffff'];
    }
  };

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const createParticle = (id: number): Particle => {
      const colors = getParticleColors(type);
      return {
        id,
        x: Math.random() * 100,
        y: 100,
        size: Math.random() * 6 + 3,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 3,
        speedY: -(Math.random() * 4 + 2),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      };
    };

    const initialParticles = Array.from({ length: 25 }, (_, i) => createParticle(i));
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.speedX,
          y: particle.y + particle.speedY,
          opacity: particle.opacity - 0.015,
          size: particle.size * 0.985,
          rotation: particle.rotation + particle.rotationSpeed
        })).filter(particle => particle.opacity > 0 && particle.y > -20)
      );
    }, 30);

    return () => clearInterval(interval);
  }, [isActive, type]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            bottom: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 4}px ${particle.color}, inset 0 0 ${particle.size}px rgba(255,255,255,0.3)`,
            transform: `rotate(${particle.rotation}deg) scale(${1 + Math.sin(particle.id * 0.1) * 0.2})`,
            filter: `blur(${particle.size * 0.1}px)`,
            animation: 'pulse 3s infinite ease-in-out',
            mixBlendMode: 'screen'
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffect;