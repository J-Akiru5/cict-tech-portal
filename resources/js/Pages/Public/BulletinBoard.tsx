import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Achievement {
    id: number;
    title: string;
    description: string;
    type: string;
    typeIcon: string;
    imageUrl: string | null;
    achievedDate: string | null;
    isFeatured: boolean;
    linkUrl: string | null;
    linkText: string | null;
}

interface Props {
    achievements: Achievement[];
    featured: Achievement[];
    types: Record<string, string>;
    currentType: string;
}

// Carousel component for featured items
const FeaturedCarousel = ({ items }: { items: Achievement[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (items.length <= 1) return;
        
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [items.length]);

    if (items.length === 0) return null;

    const currentItem = items[currentIndex];

    return (
        <div className="relative mb-12 overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-br from-gold-500/10 to-maroon-900/30 p-8 md:p-12">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px]" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-8">
                {/* Icon */}
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gold-500/20 text-5xl">
                    {currentItem.typeIcon}
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold text-gold-400">
                        ⭐ Featured
                    </div>
                    <h2 className="text-2xl font-bold text-white md:text-3xl">
                        {currentItem.title}
                    </h2>
                    <p className="mt-3 text-white/70 line-clamp-2">
                        {currentItem.description}
                    </p>
                    {currentItem.achievedDate && (
                        <p className="mt-2 text-sm text-white/50">
                            {currentItem.achievedDate}
                        </p>
                    )}
                </div>
            </div>

            {/* Carousel Dots */}
            {items.length > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                                idx === currentIndex
                                    ? 'w-8 bg-gold-500'
                                    : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Achievement Card
const AchievementCard = ({ item }: { item: Achievement }) => {
    return (
        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-white/10 hover:-translate-y-1">
            {/* Type Badge */}
            <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl">{item.typeIcon}</span>
                {item.isFeatured && (
                    <span className="rounded-full bg-gold-500/20 px-2 py-0.5 text-xs text-gold-400">
                        Featured
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">
                {item.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-sm text-white/60 line-clamp-3">
                {item.description}
            </p>

            {/* Date */}
            {item.achievedDate && (
                <p className="mt-4 text-xs text-white/40">
                    {item.achievedDate}
                </p>
            )}

            {/* Link */}
            {item.linkUrl && (
                <a
                    href={item.linkUrl}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-400 hover:underline"
                >
                    {item.linkText || 'Learn more'}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            )}
        </div>
    );
};

export default function BulletinBoard({ achievements, featured, types, currentType }: Props) {
    const handleTypeChange = (type: string) => {
        router.get('/bulletin', { type }, { preserveState: true, replace: true });
    };

    return (
        <PublicLayout>
            <Head title="Digital Bulletin Board" />
            
            <div className="min-h-screen pt-28 pb-16">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-white md:text-5xl">
                            Digital Bulletin Board
                        </h1>
                        <p className="mt-4 text-lg text-white/60">
                            Celebrating achievements, programs, and milestones
                        </p>
                    </div>

                    {/* Featured Carousel */}
                    {featured.length > 0 && (
                        <FeaturedCarousel items={featured} />
                    )}

                    {/* Type Filter */}
                    <div className="mb-10 flex flex-wrap justify-center gap-3">
                        {Object.entries(types).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => handleTypeChange(key)}
                                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                                    currentType === key
                                        ? 'bg-gold-500 text-maroon-900 shadow-lg shadow-gold-500/30'
                                        : 'border border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Achievements Grid */}
                    {achievements.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-xl text-white/60">No items found</h3>
                            <p className="text-white/40 mt-2">Check back later for updates</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {achievements.map((item) => (
                                <AchievementCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
