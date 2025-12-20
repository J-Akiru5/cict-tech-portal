import { useRef, useEffect, useState, useMemo } from 'react';

interface HexCell {
    id: string;
    cx: number;
    cy: number;
    path: string;
    // Physics state stored in mutable objects to avoid react render cycle
    physics: {
        currentLift: number;
        velocity: number;
        targetLift: number;
    };
}

export default function HoneycombBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    
    // Config
    const R = 50; 
    const GAP = 2;
    const EFFECT_RADIUS = 100;
    
    // Physics Config
    const SPRING_STIFFNESS = 0.03; // Lower = softer spring (slower return)
    const DAMPING = 0.95; // Higher = more oscillation/trail
    const MAX_LIFT = 30; // Pixels
    const MOUSE_FORCE = 2.0; // How fast it reacts to mouse

    // Cells Ref to allow access inside RAF without dependency hell
    const cellsRef = useRef<HexCell[]>([]);
    
    // DOM Refs for direct manipulation
    const pathRefs = useRef<{ [key: string]: SVGPathElement | null }>({});

    // Track mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                mouseRef.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            }
        };

        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };
        
        handleResize();
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Generate Grid on Resize
    useMemo(() => {
        const cells: HexCell[] = [];
        if (dimensions.width === 0) {
            cellsRef.current = [];
            return;
        }

        const W = Math.sqrt(3) * R;
        const H = 2 * R;
        const hexRadius = R - GAP;
        const hexWidth = Math.sqrt(3) * hexRadius;

        const colSpacing = W;
        const rowSpacing = H * 0.75;
        const cols = Math.ceil(dimensions.width / colSpacing) + 2;
        const rows = Math.ceil(dimensions.height / rowSpacing) + 2;

        for (let row = -1; row < rows; row++) {
            for (let col = -1; col < cols; col++) {
                const isOddRow = row % 2 !== 0;
                const cx = col * colSpacing + (isOddRow ? colSpacing / 2 : 0);
                const cy = row * rowSpacing;

                const path = [
                    `M ${cx} ${cy - hexRadius}`,
                    `L ${cx + hexWidth / 2} ${cy - hexRadius / 2}`,
                    `L ${cx + hexWidth / 2} ${cy + hexRadius / 2}`,
                    `L ${cx} ${cy + hexRadius}`,
                    `L ${cx - hexWidth / 2} ${cy + hexRadius / 2}`,
                    `L ${cx - hexWidth / 2} ${cy - hexRadius / 2}`,
                    'Z'
                ].join(' ');

                cells.push({ 
                    id: `hex-${row}-${col}`, 
                    cx, 
                    cy, 
                    path,
                    physics: { currentLift: 0, velocity: 0, targetLift: 0 }
                });
            }
        }
        cellsRef.current = cells;
    }, [dimensions]);

    // Animation Loop (RAF)
    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            const mouse = mouseRef.current;

            cellsRef.current.forEach(cell => {
                const dx = cell.cx - mouse.x;
                const dy = cell.cy - mouse.y;
                const distDist = dx * dx + dy * dy; // Distance squared
                const dist = Math.sqrt(distDist);

                // Calculate Target Force based on Mouse Proximity
                let target = 0;
                if (dist < EFFECT_RADIUS) {
                    const intensity = 1 - dist / EFFECT_RADIUS;
                    // Ease the intensity: exponential for sharper center
                    target = intensity * intensity * MAX_LIFT;
                }

                // Apply Physics
                // Force = (Target - Current) * SpeedFactor
                // But specifically for "Trail", we want the mouse to "kick" the velocity,
                // and the spring to pull it back.
                
                // Spring Physics:
                // Force = Spring + Damping
                // Spring pushes towards Target.
                // Actually, let's treat 'target' as the equilibrium position for the spring momentarily.
                
                const force = (target - cell.physics.currentLift) * SPRING_STIFFNESS;
                cell.physics.velocity += force;
                cell.physics.velocity *= DAMPING;
                cell.physics.currentLift += cell.physics.velocity;
                
                // Clamp slightly to prevent micro-jitter near zero? 
                if (Math.abs(cell.physics.currentLift) < 0.01 && Math.abs(cell.physics.velocity) < 0.01 && target === 0) {
                    cell.physics.currentLift = 0;
                    cell.physics.velocity = 0;
                }

                // Render Update
                const element = pathRefs.current[cell.id];
                const underglowElement = pathRefs.current[`glow-${cell.id}`];
                
                if (element && underglowElement) {
                    // Only update DOM if moving significantly or active
                    if (cell.physics.currentLift > 0.1 || cell.physics.velocity !== 0) {
                        const lift = cell.physics.currentLift; // Negative Y is up? 
                        // User wanted "Lift". translateY negative.
                        // My variable currentLift is positive magnitude.
                        
                        const translateY = -lift; 
                        const scale = 1 + (lift / MAX_LIFT) * 0.1;
                        
                        element.style.transform = `translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(3)})`;
                        
                        // Opacity / brightness based on lift height
                        // Resting opacity: 0.2. Max opacity: 1.
                        const opacity = 0.2 + (lift / MAX_LIFT) * 0.8;
                        element.style.opacity = opacity.toFixed(2);
                        
                        // Update Underglow
                        // Underglow intensity matches lift
                        const glowOpacity = (lift / MAX_LIFT) * 0.8;
                        underglowElement.style.opacity = glowOpacity.toFixed(2);
                        
                        // Set active attributes strictly on change? 
                        // To allow "Pure Dark" floating hex:
                        if (lift > 1) {
                           // Set fill to opaque dark metal if not already
                             element.setAttribute('fill', 'url(#metal-dark)');
                             // Set stroke
                             element.setAttribute('stroke', '#333');
                             element.setAttribute('stroke-width', '1');
                             element.style.filter = 'url(#lift-shadow-deep)';
                        }
                    } else {
                        // Reset to resting state if settled
                        if (element.style.transform !== '') {
                            element.style.transform = '';
                            element.style.opacity = '0.2';
                            element.style.filter = 'none';
                            element.setAttribute('fill', 'url(#metal-dark)');
                            element.setAttribute('stroke', 'rgba(255,255,255,0.03)');
                            element.setAttribute('stroke-width', '0.5');
                        }
                        if (underglowElement.style.opacity !== '0') {
                            underglowElement.style.opacity = '0';
                        }
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions]); // Re-bind RAF if dimensions (and thus cells) change

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden z-0 bg-[#050505]"
        >
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="metal-dark" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#151515" />
                        <stop offset="100%" stopColor="#0a0a0a" />
                    </linearGradient>

                    <filter id="underglow-intense" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                        <feFlood floodColor="#ff0040" floodOpacity="1" result="color" />
                        <feComposite in="color" in2="blur" operator="in" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="glow" />
                        </feMerge>
                    </filter>
                    
                    <filter id="lift-shadow-deep" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="15" stdDeviation="10" floodColor="#000" floodOpacity="1" />
                    </filter>
                </defs>

                {/* Layer 1: Underglow */}
                <g>
                    {cellsRef.current.map(cell => (
                        <path
                            key={`glow-${cell.id}`}
                            ref={el => pathRefs.current[`glow-${cell.id}`] = el}
                            d={cell.path}
                            fill="#ff0040"
                            stroke="none"
                            filter="url(#underglow-intense)"
                            opacity="0" // Controlled by JS
                            style={{
                                transformOrigin: `${cell.cx}px ${cell.cy}px`,
                                transform: `scale(0.9)`
                            }}
                        />
                    ))}
                </g>

                {/* Layer 2: Hex Tiles */}
                <g>
                    {cellsRef.current.map(cell => (
                        <path
                            key={cell.id}
                            ref={el => pathRefs.current[cell.id] = el}
                            d={cell.path}
                            fill="url(#metal-dark)"
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth="0.5"
                            style={{
                                transformOrigin: `${cell.cx}px ${cell.cy}px`,
                                opacity: 0.2 // Initial resting opacity
                            }}
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
}
