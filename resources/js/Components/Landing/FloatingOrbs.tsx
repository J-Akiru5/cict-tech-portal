import React from 'react';

interface OrbProps {
    src: string;
    size: string; // Tailwind class like w-64 or arbitrary value like w-[500px]
    className?: string; // For positioning and extra styles
    speed: string | number; // data-scroll-speed
    delay?: string; // Animation delay
    direction?: 'normal' | 'reverse'; // Rotate direction
    blur?: string; // blur amount
}

const Orb: React.FC<OrbProps> = ({ 
    src, 
    size, 
    className = "", 
    speed,
    delay = "0s",
    direction = 'normal',
    blur = 'blur-xl'
}) => {
    return (
        <div
            data-scroll
            data-scroll-speed={speed}
            className={`absolute ${className} pointer-events-none select-none z-0 mix-blend-screen opacity-80`}
        >
            <div 
                className={`transform transition-transform will-change-transform ${blur}`}
                style={{
                    animation: `slowRotate 120s linear infinite ${direction === 'reverse' ? 'reverse' : 'normal'}`,
                    animationDelay: delay
                }}
            >
                <img 
                    src={src} 
                    alt="" 
                    className={`${size} h-auto object-contain max-w-none`}
                    draggable={false}
                />
            </div>
            <style>{`
                @keyframes slowRotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export const FloatingOrbs: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Huge Red Orb - Main Background Accent (moves slowly) */}
            <Orb 
                src="/assets/svg/red_orb.svg"
                size="w-[800px] md:w-[1200px]"
                speed="-0.5"
                className="-top-40 -right-40 opacity-40"
                blur="blur-3xl"
                direction="normal"
            />
            
            {/* Retro Orb - Foreground Detail (moves faster) */}
            <Orb 
                src="/assets/svg/retro_orb.svg"
                size="w-[400px] md:w-[600px]"
                speed="2"
                className="top-1/4 -left-20 opacity-60"
                blur="blur-2xl"
                direction="reverse"
                delay="-20s"
            />
            
            {/* Random Orb - Bottom filler (mid speed) */}
            <Orb 
                src="/assets/svg/random_orb.svg"
                size="w-[300px] md:w-[500px]"
                speed="1"
                className="bottom-0 right-1/4 opacity-50"
                blur="blur-xl"
                delay="-50s"
            />

             {/* Dynamic "Story" Elements - Deep Background */}
             <div 
                data-scroll 
                data-scroll-speed="-2"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
            >
                 <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px] mix-blend-screen" />
                 <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-maroon-500/20 rounded-full blur-[100px] mix-blend-screen" />
            </div>
        </div>
    );
};

export default FloatingOrbs;
