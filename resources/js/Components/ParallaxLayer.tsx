import React, { forwardRef, PropsWithChildren } from 'react';
import { useParallax } from '../hooks/useGSAP';

interface ParallaxLayerProps extends PropsWithChildren {
    speed?: number;
    className?: string;
    as?: keyof JSX.IntrinsicElements;
}

/**
 * ParallaxLayer - A layer that moves at a different speed relative to scroll
 * 
 * Speed values:
 * - Negative (-0.5 to -3): Moves slower than scroll (background depth effect)
 * - Zero: Moves with scroll (no parallax)
 * - Positive (0.5 to 3): Moves faster than scroll (foreground pop-out effect)
 * 
 * @example
 * <ParallaxLayer speed={-1} className="absolute inset-0">
 *   <BackgroundImage />
 * </ParallaxLayer>
 */
export const ParallaxLayer = forwardRef<HTMLDivElement, ParallaxLayerProps>(
    ({ children, speed = 0, className = '', as: Component = 'div' }, _ref) => {
        const parallaxRef = useParallax<HTMLDivElement>({ speed });

        return (
            <div ref={parallaxRef} className={className}>
                {children}
            </div>
        );
    }
);

ParallaxLayer.displayName = 'ParallaxLayer';

export default ParallaxLayer;
