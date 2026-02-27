import { useEffect } from 'react';

/**
 * useRestartAnimations Hook
 * Forces CSS animations to restart when component mounts
 * Perfect for fixing animations that stop after route navigation
 */
export function useRestartAnimations() {
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Find all elements with float animations
      const animatedElements = document.querySelectorAll(
        '[class*="animate-float"], [class*="animate-spin"], [class*="animate-pulse"], [class*="animate-gradient"]'
      );
      
      animatedElements.forEach((element) => {
        // Get current animation
        const currentAnimation = window.getComputedStyle(element).animation;
        
        // Force restart by removing and re-adding animation
        element.style.animation = 'none';
        
        // Trigger reflow (this is necessary!)
        void element.offsetHeight;
        
        // Restore animation
        element.style.animation = currentAnimation;
      });
    }, 50);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array = runs once on mount
}

/**
 * Alternative: Higher-order component approach
 * Wrap your page component with this
 */
export function withRestartAnimations(Component) {
  return function WrappedComponent(props) {
    useRestartAnimations();
    return <Component {...props} />;
  };
}

// USAGE EXAMPLE:
/*
import { useRestartAnimations } from '@/hooks/useRestartAnimations';

function HomePage() {
  // Add this hook at the top of your component
  useRestartAnimations();
  
  return (
    <div>
      <div className="animate-float-slow">
        Ball 1
      </div>
      <div className="animate-float-slower">
        Ball 2
      </div>
    </div>
  );
}

// OR use the HOC approach:
export default withRestartAnimations(HomePage);
*/
