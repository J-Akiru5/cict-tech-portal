import { Head } from '@inertiajs/react';
import TunnelTimeline from '@/Components/Timeline/TunnelTimeline';

/**
 * Timeline highlight type from Laravel
 */
export interface TimelineHighlight {
    id: number;
    year: number;
    term_label: string;
    title: string;
    description: string;
    type: string;
    icon: string;
    color: string;
    is_featured: boolean;
}

interface TimelineDemoProps {
    highlights: TimelineHighlight[];
}

/**
 * Timeline Demo Page - Showcases the 3D Tunnel Timeline with database content
 */
export default function TimelineDemo({ highlights }: TimelineDemoProps) {
    return (
        <>
            <Head title="CICT Timeline - IT Through the Years" />
            <TunnelTimeline highlights={highlights} />
        </>
    );
}
