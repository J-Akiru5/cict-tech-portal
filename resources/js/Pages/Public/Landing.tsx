import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import HeroSection from '@/Components/Landing/HeroSection';
import FeaturesSection from '@/Components/Landing/FeaturesSection';
import AnnouncementsPreview from '@/Components/Landing/AnnouncementsPreview';
import OrgChartPreview from '@/Components/Landing/OrgChartPreview';
import ThroughTheYearsPreview from '@/Components/Landing/ThroughTheYearsPreview';

/**
 * Landing Page - CICT IT Tech Portal
 * 
 * Features:
 * - Parallax hero section with floating orbs
 * - Glassmorphic feature cards
 * - Announcements preview
 * - Org chart preview
 * - IT Through the Years timeline preview
 * - Locomotive Scroll integration
 */
export default function Landing({
    auth,
}: PageProps) {
    return (
        <PublicLayout>
            <Head title="Welcome to CICT Tech Portal" />
            
            {/* Hero Section */}
            <HeroSection isLoggedIn={!!auth.user} />
            
            {/* Features Section */}
            <FeaturesSection />
            
            {/* Announcements Preview */}
            <AnnouncementsPreview />
            
            {/* Org Chart Preview */}
            <OrgChartPreview />

            {/* IT Through the Years */}
            <ThroughTheYearsPreview />
        </PublicLayout>
    );
}
