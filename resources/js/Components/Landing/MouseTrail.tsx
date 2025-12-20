import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
}

interface MouseTrailProps {
    className?: string;
}

export const MouseTrail: React.FC<MouseTrailProps> = ({ className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>();
    const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
    const containerRef = useRef<DOMRect | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const updateCanvasSize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                containerRef.current = parent.getBoundingClientRect();
            }
        };

        // Initial sizing
        updateCanvasSize();
        
        // Update on resize and scroll since rect might change
        window.addEventListener('resize', updateCanvasSize);
        window.addEventListener('scroll', updateCanvasSize);

        const spawnParticle = (x: number, y: number) => {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.5;
            
            particlesRef.current.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.5,
                life: 1,
                maxLife: 50 + Math.random() * 20,
                size: 4 + Math.random() * 8,
                color: Math.random() > 0.5 ? 'maroon' : 'gold'
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            // Calculate relative coordinates
            const rect = containerRef.current;
            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;

            // Check if mouse is inside the container
            if (
                relativeX < 0 || 
                relativeX > rect.width || 
                relativeY < 0 || 
                relativeY > rect.height
            ) {
                // Should we stop spawning? Or just update positions?
                // Let's stop updating the mouseRef for spawning if outside
                return;
            }

            mouseRef.current.prevX = mouseRef.current.x || relativeX;
            mouseRef.current.prevY = mouseRef.current.y || relativeY;
            mouseRef.current.x = relativeX;
            mouseRef.current.y = relativeY;

            // Interpolate
            const dx = mouseRef.current.x - mouseRef.current.prevX;
            const dy = mouseRef.current.y - mouseRef.current.prevY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const steps = Math.max(1, Math.floor(dist / 5));
            
            for (let i = 0; i < steps; i++) {
                const px = mouseRef.current.prevX + (dx * (i / steps));
                const py = mouseRef.current.prevY + (dy * (i / steps));
                
                const offsetX = (Math.random() - 0.5) * 10;
                const offsetY = (Math.random() - 0.5) * 10;
                
                spawnParticle(px + offsetX, py + offsetY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Use lighter composite for glow, but fallback to source-over if needed
            ctx.globalCompositeOperation = 'lighter';

            // Filter dead particles
            particlesRef.current = particlesRef.current.filter(p => p.life > 0);

            for (const p of particlesRef.current) {
                p.x += p.vx;
                p.y += p.vy;
                p.size *= 0.98;
                p.life -= 1;

                const opacity = p.life / p.maxLife;
                const currentSize = p.size * (opacity + 0.5);

                ctx.beginPath();
                ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
                
                if (p.color === 'gold') {
                    // Boosted opacity for better visibility
                    ctx.fillStyle = `rgba(255, 190, 50, ${opacity * 0.6})`;
                } else {
                    ctx.fillStyle = `rgba(180, 40, 40, ${opacity * 0.5})`;
                }
                
                ctx.fill();
            }
            
            ctx.globalCompositeOperation = 'source-over';

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            window.removeEventListener('scroll', updateCanvasSize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-none absolute inset-0 z-0 ${className || ''}`}
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default MouseTrail;
