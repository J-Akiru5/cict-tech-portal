import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

interface UseParallaxOptions {
    speed?: number;
    direction?: 'vertical' | 'horizontal';
    trigger?: string | HTMLElement;
    start?: string;
    end?: string;
    scrub?: boolean | number;
}

/**
 * useParallax - Custom hook for GSAP ScrollTrigger parallax effects
 * 
 * @param options - Configuration for the parallax effect
 * @returns ref to attach to the element
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
    options: UseParallaxOptions = {}
) {
    const {
        speed = 1,
        direction = 'vertical',
        start = 'top bottom',
        end = 'bottom top',
        scrub = true,
    } = options;

    const elementRef = useRef<T>(null);

    useLayoutEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const ctx = gsap.context(() => {
            // Calculate movement based on speed
            // Positive speed = moves faster than scroll (foreground)
            // Negative speed = moves slower than scroll (background depth)
            const movement = window.innerHeight * speed;
            
            const animationProps = direction === 'vertical' 
                ? { y: movement }
                : { x: movement };

            gsap.fromTo(element, 
                { 
                    y: direction === 'vertical' ? -movement / 2 : 0,
                    x: direction === 'horizontal' ? -movement / 2 : 0,
                },
                {
                    ...animationProps,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: element.parentElement || element,
                        start,
                        end,
                        scrub: scrub === true ? 0.5 : scrub, // Smooth scrub
                    },
                }
            );
        });

        return () => ctx.revert(); // Cleanup
    }, [speed, direction, start, end, scrub]);

    return elementRef;
}

/**
 * useScrollAnimation - Trigger animations when element enters viewport
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    animation: gsap.TweenVars,
    triggerOptions: ScrollTrigger.Vars = {}
) {
    const elementRef = useRef<T>(null);

    useLayoutEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const ctx = gsap.context(() => {
            gsap.from(element, {
                ...animation,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    end: 'top 50%',
                    toggleActions: 'play none none reverse',
                    ...triggerOptions,
                },
            });
        });

        return () => ctx.revert();
    }, [animation, triggerOptions]);

    return elementRef;
}

/**
 * usePinSection - Pin an element while scrolling
 */
export function usePinSection<T extends HTMLElement = HTMLElement>(
    duration: number = 1,
    options: Partial<ScrollTrigger.Vars> = {}
) {
    const elementRef = useRef<T>(null);

    useLayoutEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: element,
                start: 'top top',
                end: `+=${window.innerHeight * duration}`,
                pin: true,
                scrub: true,
                ...options,
            });
        });

        return () => ctx.revert();
    }, [duration, options]);

    return elementRef;
}

export { gsap, ScrollTrigger };
