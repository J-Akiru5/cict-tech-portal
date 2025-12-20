import { motion } from 'framer-motion';
import { useMemo, useCallback } from 'react';

/**
 * HexIslands Component
 * 
 * Creates scattered HONEYCOMB clusters of hexagonal tiles.
 * Each island is a proper honeycomb pattern, not random scatter.
 * Features metallic texture with maroon+gold hover glow.
 */

interface HexPosition {
    id: string;
    row: number;
    col: number;
    x: number;
    y: number;
    delay: number;
}

interface Island {
    id: number;
    centerX: number;
    centerY: number;
    tiles: HexPosition[];
    rotation: number;
}

// Generate a honeycomb cluster centered at origin
function generateHoneycombCluster(
    islandId: number,
    size: number, // How many rings (1 = 7 tiles, 2 = 19 tiles, etc)
    tileSize: number
): HexPosition[] {
    const tiles: HexPosition[] = [];
    const tileHeight = tileSize * 1.1547;
    const hSpacing = tileSize * 0.76;
    const vSpacing = tileHeight * 0.75;
    
    let tileIndex = 0;
    
    // Generate hexagonal rings
    for (let ring = 0; ring <= size; ring++) {
        if (ring === 0) {
            // Center tile
            tiles.push({
                id: `island-${islandId}-tile-${tileIndex++}`,
                row: 0,
                col: 0,
                x: 0,
                y: 0,
                delay: tileIndex * 0.03,
            });
        } else {
            // Each ring has 6 * ring tiles
            for (let side = 0; side < 6; side++) {
                for (let step = 0; step < ring; step++) {
                    // Calculate hex position based on axial coordinates
                    let q = 0, r = 0;
                    
                    // Start position for each side
                    switch (side) {
                        case 0: q = ring; r = -ring + step; break;
                        case 1: q = ring - step; r = step; break;
                        case 2: q = -step; r = ring; break;
                        case 3: q = -ring; r = ring - step; break;
                        case 4: q = -ring + step; r = -step; break;
                        case 5: q = step; r = -ring; break;
                    }
                    
                    // Convert axial to pixel
                    const x = hSpacing * (q + r * 0.5);
                    const y = vSpacing * r;
                    
                    tiles.push({
                        id: `island-${islandId}-tile-${tileIndex++}`,
                        row: r,
                        col: q,
                        x,
                        y,
                        delay: islandId * 0.15 + tileIndex * 0.02,
                    });
                }
            }
        }
    }
    
    return tiles;
}

// Predefined island positions - well-spaced to prevent overlap
// Islands are placed at corners and edges, leaving center clear for content
const ISLAND_CONFIGS = [
    // Top-left region (single large island)
    { x: 0.05, y: 0.12, size: 2, rotation: 0 },
    
    // Top-right region (single large island)
    { x: 0.92, y: 0.08, size: 2, rotation: 0 },
    
    // Left edge - middle
    { x: 0.03, y: 0.50, size: 1, rotation: 0 },
    
    // Right edge - middle  
    { x: 0.97, y: 0.45, size: 1, rotation: 0 },
    
    // Bottom-left region
    { x: 0.08, y: 0.85, size: 2, rotation: 0 },
    
    // Bottom-right region
    { x: 0.90, y: 0.88, size: 2, rotation: 0 },
    
    // Top center-left (small)
    { x: 0.28, y: 0.05, size: 1, rotation: 0 },
    
    // Top center-right (small)
    { x: 0.72, y: 0.03, size: 1, rotation: 0 },
];

function generateIslands(tileSize: number): Island[] {
    return ISLAND_CONFIGS.map((config, index) => ({
        id: index,
        centerX: config.x,
        centerY: config.y,
        rotation: config.rotation,
        tiles: generateHoneycombCluster(index, config.size, tileSize),
    }));
}

interface MetallicHexTileProps {
    tile: HexPosition;
    size: number;
}

function MetallicHexTile({ tile, size }: MetallicHexTileProps) {
    const tileHeight = size * 1.1547;
    
    return (
        <motion.div
            className="absolute cursor-pointer"
            style={{
                width: size,
                height: tileHeight,
                left: tile.x,
                top: tile.y,
                transform: 'translate(-50%, -50%)',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
            initial={{
                opacity: 0,
                scale: 0,
            }}
            animate={{
                opacity: 0.75,
                scale: 1,
                transition: { 
                    delay: tile.delay, 
                    duration: 0.6, 
                    ease: [0.25, 0.46, 0.45, 0.94]
                }
            }}
            whileHover={{
                scale: 1.25,
                opacity: 1,
                zIndex: 100,
                transition: {
                    type: 'spring',
                    stiffness: 500,
                    damping: 25,
                }
            }}
        >
            {/* Metallic base - dark steel */}
            <div
                className="absolute inset-0"
                style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    background: `
                        linear-gradient(
                            145deg,
                            rgba(70, 70, 80, 0.95) 0%,
                            rgba(40, 42, 50, 0.98) 25%,
                            rgba(55, 58, 68, 0.95) 50%,
                            rgba(35, 38, 45, 0.98) 75%,
                            rgba(50, 52, 60, 0.95) 100%
                        )
                    `,
                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.4)',
                }}
            />
            
            {/* Metallic highlight edge */}
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    background: `
                        linear-gradient(
                            135deg,
                            rgba(255, 255, 255, 0.2) 0%,
                            transparent 30%,
                            transparent 70%,
                            rgba(0, 0, 0, 0.3) 100%
                        )
                    `,
                }}
            />
            
            {/* Inner bevel */}
            <div
                className="absolute inset-[2px]"
                style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    background: 'linear-gradient(180deg, rgba(80,85,95,0.8) 0%, rgba(45,48,55,0.9) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
            />

            {/* Hover Glow - Maroon + Gold combo */}
            <motion.div
                className="absolute -inset-2 opacity-0"
                whileHover={{
                    opacity: 1,
                    transition: { duration: 0.2 }
                }}
            >
                {/* Outer gold glow */}
                <div
                    className="absolute inset-0"
                    style={{
                        filter: 'blur(12px)',
                        background: 'radial-gradient(circle, rgba(212, 160, 23, 0.5) 0%, transparent 70%)',
                    }}
                />
                {/* Inner maroon glow */}
                <div
                    className="absolute inset-2"
                    style={{
                        filter: 'blur(8px)',
                        background: 'radial-gradient(circle, rgba(160, 30, 50, 0.8) 0%, transparent 60%)',
                    }}
                />
            </motion.div>

            {/* Active hover overlay */}
            <motion.div
                className="absolute inset-0 opacity-0"
                style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
                whileHover={{
                    opacity: 1,
                    transition: { duration: 0.2 }
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(circle at 30% 30%, 
                                rgba(212, 160, 23, 0.4) 0%, 
                                rgba(160, 30, 50, 0.6) 40%,
                                rgba(100, 20, 40, 0.8) 100%
                            )
                        `,
                    }}
                />
            </motion.div>
        </motion.div>
    );
}

interface HexIslandsProps {
    tileSize?: number;
    className?: string;
}

export function HexIslands({ 
    tileSize = 80,
    className = '' 
}: HexIslandsProps) {
    const islands = useMemo(() => generateIslands(tileSize), [tileSize]);

    return (
        <div className={`absolute inset-0 overflow-hidden ${className}`}>
            {islands.map((island) => (
                <div
                    key={island.id}
                    className="absolute"
                    style={{
                        left: `${island.centerX * 100}%`,
                        top: `${island.centerY * 100}%`,
                        transform: `rotate(${island.rotation}deg)`,
                    }}
                >
                    {island.tiles.map((tile) => (
                        <MetallicHexTile
                            key={tile.id}
                            tile={tile}
                            size={tileSize}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default HexIslands;
