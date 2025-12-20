import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * HexTile Component
 * 
 * A single hexagonal tile using CSS clip-path.
 * Features smooth framer-motion physics-based hover animations.
 */
interface HexTileProps {
    id: number;
    size?: number; // Size in pixels
}

export function HexTile({ id, size = 80 }: HexTileProps) {
    // Randomize the initial animation delay for a staggered entrance effect
    const delay = useMemo(() => (id % 20) * 0.02, [id]);

    return (
        <motion.div
            className="hex-tile relative cursor-pointer"
            style={{
                width: size,
                height: size * 1.1547, // Height ratio for regular hexagon (2/√3)
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
            initial={{
                scale: 1,
                opacity: 0,
                backgroundColor: 'rgba(30, 41, 59, 0.6)', // slate-800 with opacity
            }}
            animate={{
                opacity: 0.8,
                transition: { delay, duration: 0.5 }
            }}
            whileHover={{
                scale: 1.15,
                zIndex: 50,
                backgroundColor: '#800000', // Maroon
                opacity: 1,
                boxShadow: '0 0 30px 5px rgba(128, 0, 0, 0.6), inset 0 0 20px rgba(255, 100, 100, 0.3)',
                transition: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 17,
                }
            }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Inner glow layer */}
            <motion.div
                className="absolute inset-0"
                style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
                }}
            />
            
            {/* Border effect */}
            <div
                className="absolute inset-[2px]"
                style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    background: 'linear-gradient(180deg, rgba(100, 116, 139, 0.3) 0%, rgba(30, 41, 59, 0.8) 100%)',
                }}
            />
        </motion.div>
    );
}

/**
 * HexGrid Component
 * 
 * Creates a honeycomb pattern of HexTiles.
 * Uses flexbox with negative margins for the interlocking effect.
 */
interface HexGridProps {
    rows?: number;
    tilesPerRow?: number;
    tileSize?: number;
    className?: string;
}

export function HexGrid({ 
    rows = 8, 
    tilesPerRow = 12, 
    tileSize = 80,
    className = '' 
}: HexGridProps) {
    // Calculate dimensions for proper honeycomb spacing
    const tileHeight = tileSize * 1.1547;
    const horizontalSpacing = tileSize + 4; // tile width + gap
    const verticalSpacing = tileHeight * 0.75; // Overlap by 25% for honeycomb
    const rowOffset = tileSize / 2 + 2; // Half tile + half gap for stagger

    const totalTiles = rows * tilesPerRow;

    // Group tiles into rows
    const rowsArray = Array.from({ length: rows }, (_, rowIndex) => 
        Array.from({ length: tilesPerRow }, (_, colIndex) => rowIndex * tilesPerRow + colIndex)
    );

    return (
        <div 
            className={`hex-grid relative overflow-hidden ${className}`}
            style={{
                // CSS custom properties for the honeycomb math
                ['--tile-size' as string]: `${tileSize}px`,
                ['--tile-height' as string]: `${tileHeight}px`,
                ['--h-spacing' as string]: `${horizontalSpacing}px`,
                ['--v-spacing' as string]: `${verticalSpacing}px`,
                ['--row-offset' as string]: `${rowOffset}px`,
            }}
        >
            {rowsArray.map((rowTiles, rowIndex) => (
                <div
                    key={rowIndex}
                    className="hex-row flex"
                    style={{
                        marginTop: rowIndex === 0 ? 0 : `-${tileHeight * 0.25}px`,
                        marginLeft: rowIndex % 2 === 1 ? rowOffset : 0,
                    }}
                >
                    {rowTiles.map((tileId) => (
                        <div
                            key={tileId}
                            className="hex-cell"
                            style={{ margin: '2px' }}
                        >
                            <HexTile id={tileId} size={tileSize} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

/**
 * HexWallBackground Component
 * 
 * A full-screen sci-fi hexagon wall background.
 * Perfect for landing pages and hero sections.
 */
interface HexWallBackgroundProps {
    tileSize?: number;
    className?: string;
}

export function HexWallBackground({ tileSize = 70, className = '' }: HexWallBackgroundProps) {
    // Calculate how many tiles we need based on a reasonable viewport
    const estimatedRows = 12;
    const estimatedCols = 20;

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-auto ${className}`}>
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-maroon-950/30 to-maroon-950/80 pointer-events-none z-10" />
            
            {/* The hex grid */}
            <div className="absolute inset-0 flex items-center justify-center">
                <HexGrid 
                    rows={estimatedRows} 
                    tilesPerRow={estimatedCols} 
                    tileSize={tileSize}
                    className="transform -translate-y-[10%]"
                />
            </div>
            
            {/* Vignette effect */}
            <div 
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
                }}
            />
        </div>
    );
}

export default HexGrid;
