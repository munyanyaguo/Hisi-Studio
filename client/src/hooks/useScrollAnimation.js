import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * Detects scroll direction and triggers appropriate animation classes
 */
const useScrollAnimation = (options = {}) => {
    const {
        threshold = 0.1,
        rootMargin = '0px',
        triggerOnce = false
    } = options;

    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [scrollDirection, setScrollDirection] = useState('down');
    const [hasAnimated, setHasAnimated] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current) {
                setScrollDirection('down');
            } else if (currentScrollY < lastScrollY.current) {
                setScrollDirection('up');
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!triggerOnce || !hasAnimated) {
                        setIsVisible(true);
                        setHasAnimated(true);
                    }
                } else {
                    if (!triggerOnce) {
                        setIsVisible(false);
                    }
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [threshold, rootMargin, triggerOnce, hasAnimated]);

    // Determine animation class based on visibility and scroll direction
    const getAnimationClass = () => {
        if (!isVisible) return 'opacity-0';
        return scrollDirection === 'down'
            ? 'animate-fadeInUp'
            : 'animate-fadeInDown';
    };

    return {
        ref,
        isVisible,
        scrollDirection,
        animationClass: getAnimationClass(),
    };
};

export default useScrollAnimation;
