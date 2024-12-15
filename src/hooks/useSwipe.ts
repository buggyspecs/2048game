import { useEffect, useCallback } from 'react';
import { Direction } from '../types/game';

interface SwipeHandlers {
  onSwipe: (direction: Direction) => void;
}

export const useSwipe = ({ onSwipe }: SwipeHandlers) => {
  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Add class to prevent scrolling
    document.body.classList.add('touching');
    
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    let hasSwiped = false;

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.cancelable || hasSwiped) return;
      
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // Increase threshold for more deliberate swipes
      const threshold = 50;
      
      if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) return;

      hasSwiped = true;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        onSwipe(deltaX > 0 ? 'right' : 'left');
      } else {
        onSwipe(deltaY > 0 ? 'down' : 'up');
      }
    };

    const handleTouchEnd = () => {
      // Remove class when touch ends
      document.body.classList.remove('touching');
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { once: true });
  }, [onSwipe]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.body.classList.remove('touching');
    };
  }, [handleTouchStart]);
};