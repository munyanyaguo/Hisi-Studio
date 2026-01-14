import React from 'react';
import useScrollAnimation from '../../hooks/useScrollAnimation';

/**
 * ScrollAnimationWrapper - Wrapper component that adds scroll animations to its children
 * Each instance triggers independently when it enters the viewport
 * Animates content from below when scrolling down, from above when scrolling up
 */
const ScrollAnimationWrapper = ({
    children,
    className = '',
    threshold = 0.15,
    triggerOnce = true,
    delay = 0
}) => {
    const { ref, animationClass, isVisible } = useScrollAnimation({
        threshold,
        triggerOnce,
        rootMargin: '0px 0px -100px 0px' // Trigger when element is 100px from bottom viewport
    });

    return (
        <div
            ref={ref}
            className={`${className} ${isVisible ? animationClass : 'opacity-0 translate-y-8'}`}
            style={{
                transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
};

export default ScrollAnimationWrapper;
