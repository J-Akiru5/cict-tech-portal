import { useRef, useLayoutEffect, ReactNode, useMemo } from 'react';
import { gsap } from '@/Hooks/useGSAP';

interface BrokenGlassTextProps {
    children: ReactNode;
    className?: string;
    scrollTrigger?: any;
    delayRatio?: number;
    durationRatio?: number;
}

// Generate VERY fine glass shards (High density)
function generateFineShards(count: number = 80) {
    const shards: { clip: string; x: number; y: number; r: number }[] = [];
    const cols = 10;
    const rows = Math.ceil(count / cols); // ~8 rows
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const baseX = (col / cols) * 100;
            const baseY = (row / rows) * 100;
            const nextX = ((col + 1) / cols) * 100;
            const nextY = ((row + 1) / rows) * 100;
            
            // Jitter for irregularity
            const jitter = 5; 
            const p1x = Math.max(0, baseX + (Math.random() - 0.5) * jitter);
            const p1y = Math.max(0, baseY + (Math.random() - 0.5) * jitter);
            const p2x = Math.min(100, nextX + (Math.random() - 0.5) * jitter);
            const p2y = Math.max(0, baseY + (Math.random() - 0.5) * jitter);
            const p3x = Math.min(100, nextX + (Math.random() - 0.5) * jitter);
            const p3y = Math.min(100, nextY + (Math.random() - 0.5) * jitter);
            const p4x = Math.max(0, baseX + (Math.random() - 0.5) * jitter);
            const p4y = Math.min(100, nextY + (Math.random() - 0.5) * jitter);
            
            // Explosion physics
            const centerX = 50;
            const centerY = 50;
            const shardCenterX = (baseX + nextX) / 2;
            const shardCenterY = (baseY + nextY) / 2;
            const distFromCenter = Math.sqrt(
                Math.pow(shardCenterX - centerX, 2) * 2 + // Wider aspect ratio bias
                Math.pow(shardCenterY - centerY, 2)
            );
            
            const angle = Math.atan2(shardCenterY - centerY, shardCenterX - centerX);
            // Stronger explosive force
            const force = 300 + distFromCenter * 15 + Math.random() * 300;
            
            shards.push({
                clip: `polygon(${p1x}% ${p1y}%, ${p2x}% ${p2y}%, ${p3x}% ${p3y}%, ${p4x}% ${p4y}%)`,
                x: Math.cos(angle) * force,
                y: Math.sin(angle) * force,
                r: (Math.random() - 0.5) * 720, // Double rotation
            });
        }
    }
    
    return shards;
}

export default function BrokenGlassText({ 
    children, 
    className = "", 
    scrollTrigger, 
    delayRatio = 0,
    durationRatio = 1 
}: BrokenGlassTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const shardsContainerRef = useRef<HTMLDivElement>(null);
    const fullTextRef = useRef<HTMLDivElement>(null);
    const shardsRef = useRef<(HTMLDivElement | null)[]>([]);
    
    // High particle count for fine grain
    const shards = useMemo(() => generateFineShards(80), []);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Initial State: 
            // 1. Shards dispersed & invisible (initially)
            // 2. Full text invisible
            gsap.set(fullTextRef.current, { opacity: 0 });
            
            shards.forEach((shard, i) => {
                const element = shardsRef.current[i];
                if (element) {
                    gsap.set(element, {
                        x: shard.x,
                        y: shard.y,
                        rotation: shard.r,
                        opacity: 0,
                        scale: 0.2,
                        filter: 'blur(10px)',
                    });
                }
            });

            if (scrollTrigger) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: scrollTrigger.triggerRef?.current || document.body,
                        start: scrollTrigger.start || 'top top',
                        end: scrollTrigger.end || '+=1000',
                        scrub: 0.5, // Reduced scrub lag for tighter feel
                        toggleActions: 'play none none reverse',
                    }
                });
                
                // 1. Assemble Shards
                shards.forEach((_, i) => {
                    const element = shardsRef.current[i];
                    if (element) {
                        // Complex staggering
                        const distFromCenter = Math.abs(i - shards.length / 2);
                        const stagger = distFromCenter * 0.005 + Math.random() * 0.05;
                        
                        tl.to(element, {
                            x: 0,
                            y: 0,
                            rotation: 0,
                            opacity: 1, // Make shards visible as they fly in
                            scale: 1,
                            filter: 'blur(0px)',
                            duration: durationRatio * 0.8, // Use most of the duration for assembly
                            ease: 'power4.out',
                        }, delayRatio + stagger);
                    }
                });
                
                // 2. Seamless Swap: Fade in Full Text, Hide Shards
                // This eliminates "cracks" by showing the perfect text layer
                const swapTime = delayRatio + durationRatio * 0.9;
                
                tl.to(fullTextRef.current, { 
                    opacity: 1, 
                    duration: 0.1,
                    ease: 'none'
                }, swapTime);
                
                tl.to(shardsContainerRef.current, { 
                    opacity: 0, 
                    duration: 0.1,
                    ease: 'none'
                }, swapTime);
            }

        }, containerRef);

        return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delayRatio, durationRatio]);

    const glassStyle = {
        color: 'rgba(255, 255, 255, 0.85)', // Slightly higher opacity
        textShadow: '0 0 25px rgba(255,255,255,0.5)',
        WebkitTextStroke: '0.5px rgba(255,255,255,0.6)',
    };

    return (
        <div ref={containerRef} className={`relative inline-block w-full h-full ${className}`}>
            
            {/* 1. Breaking Shards Container */}
            <div ref={shardsContainerRef} className="absolute inset-0 z-10 w-full h-full">
                {shards.map((shard, i) => (
                    <div
                        key={i}
                        ref={el => shardsRef.current[i] = el}
                        className="absolute inset-0 flex items-center justify-center bg-transparent will-change-transform"
                        style={{
                            clipPath: shard.clip,
                            WebkitClipPath: shard.clip,
                        }}
                    >
                        <div 
                            className="w-full text-center pointer-events-none select-none"
                            style={glassStyle}
                        >
                            {children}
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. Full Unbroken Text (Initially Hidden) */}
            <div 
                ref={fullTextRef}
                className="absolute inset-0 z-20 flex items-center justify-center opacity-0"
            >
                <div 
                    className="w-full text-center"
                    style={glassStyle}
                >
                    {children}
                </div>
            </div>
            
            {/* 3. Hidden Placeholder for Layout Dimensions */}
            <div className="opacity-0 select-none w-full text-center pointer-events-none relative z-0">
                {children}
            </div>
        </div>
    );
}
