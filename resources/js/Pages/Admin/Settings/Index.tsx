import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Cog6ToothIcon,
    GlobeAltIcon,
    AdjustmentsHorizontalIcon,
    EnvelopeIcon,
    LinkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface Settings {
    site: {
        name: string;
        tagline: string;
        description: string;
        contact_email: string;
        contact_phone: string;
        address: string;
    };
    features: {
        enrollment_enabled: boolean;
        event_registration_enabled: boolean;
        posts_enabled: boolean;
        gallery_enabled: boolean;
        maintenance_mode: boolean;
    };
    social: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
        youtube: string;
    };
    email: {
        mail_mailer: string;
        mail_host: string;
        mail_port: string;
        mail_from_address: string;
        mail_from_name: string;
    };
}

interface Props {
    settings: Settings;
}

type TabType = 'site' | 'features' | 'social' | 'email';

export default function SettingsIndex({ settings }: Props) {
    const { flash } = usePage().props as any;
    const [activeTab, setActiveTab] = useState<TabType>('site');
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(settings);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            setIsSaving(false);
            setHasChanges(false);
        }
        if (flash?.error) {
            toast.error(flash.error);
            setIsSaving(false);
        }
    }, [flash]);

    const updateSite = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            site: { ...prev.site, [key]: value },
        }));
        setHasChanges(true);
    };

    const updateFeature = (key: string, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            features: { ...prev.features, [key]: value },
        }));
        setHasChanges(true);
    };

    const updateSocial = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            social: { ...prev.social, [key]: value },
        }));
        setHasChanges(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        router.put(route('admin.settings.update'), formData as unknown as Record<string, any>, {
            preserveScroll: true,
        });
    };

    const tabs = [
        { id: 'site' as TabType, label: 'General', icon: GlobeAltIcon },
        { id: 'features' as TabType, label: 'Features', icon: AdjustmentsHorizontalIcon },
        { id: 'social' as TabType, label: 'Social Links', icon: LinkIcon },
        { id: 'email' as TabType, label: 'Email', icon: EnvelopeIcon },
    ];

    return (
        <AdminLayout>
            <Head title="Settings" />

            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Cog6ToothIcon className="h-7 w-7 text-gold-400" />
                            Settings
                        </h1>
                        <p className="text-white/60 text-sm mt-1">Configure site settings and preferences</p>
                    </div>

                    {hasChanges && (
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 font-bold hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/25 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon className="h-5 w-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-2 sticky top-24">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit}>
                            {/* Site Settings */}
                            {activeTab === 'site' && (
                                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
                                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                        <GlobeAltIcon className="h-5 w-5 text-gold-400" />
                                        General Settings
                                    </h2>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-white/90 mb-2">Site Name</label>
                                            <input
                                                type="text"
                                                value={formData.site.name}
                                                onChange={(e) => updateSite('name', e.target.value)}
                                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-white/90 mb-2">Tagline</label>
                                            <input
                                                type="text"
                                                value={formData.site.tagline}
                                                onChange={(e) => updateSite('tagline', e.target.value)}
                                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-white/90 mb-2">Description</label>
                                            <textarea
                                                value={formData.site.description}
                                                onChange={(e) => updateSite('description', e.target.value)}
                                                rows={3}
                                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 resize-none"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-white/90 mb-2">Contact Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.site.contact_email}
                                                    onChange={(e) => updateSite('contact_email', e.target.value)}
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-white/90 mb-2">Contact Phone</label>
                                                <input
                                                    type="text"
                                                    value={formData.site.contact_phone}
                                                    onChange={(e) => updateSite('contact_phone', e.target.value)}
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-white/90 mb-2">Address</label>
                                            <textarea
                                                value={formData.site.address}
                                                onChange={(e) => updateSite('address', e.target.value)}
                                                rows={2}
                                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Feature Toggles */}
                            {activeTab === 'features' && (
                                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
                                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                        <AdjustmentsHorizontalIcon className="h-5 w-5 text-gold-400" />
                                        Feature Toggles
                                    </h2>

                                    <div className="space-y-4">
                                        {[
                                            { key: 'enrollment_enabled', label: 'Student Enrollment', description: 'Allow students to enroll for membership' },
                                            { key: 'event_registration_enabled', label: 'Event Registration', description: 'Allow users to register for events' },
                                            { key: 'posts_enabled', label: 'Posts & News', description: 'Enable the posts and news section' },
                                            { key: 'gallery_enabled', label: 'Gallery', description: 'Enable the photo gallery feature' },
                                            { key: 'maintenance_mode', label: 'Maintenance Mode', description: 'Put the site in maintenance mode (only admins can access)', warning: true },
                                        ].map((feature) => (
                                            <div 
                                                key={feature.key}
                                                className={`flex items-center justify-between p-4 rounded-xl border ${
                                                    feature.warning 
                                                        ? 'bg-red-500/5 border-red-500/20' 
                                                        : 'bg-white/5 border-white/10'
                                                }`}
                                            >
                                                <div>
                                                    <p className={`font-medium ${feature.warning ? 'text-red-400' : 'text-white'}`}>
                                                        {feature.label}
                                                    </p>
                                                    <p className="text-sm text-white/50">{feature.description}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={(formData.features as any)[feature.key]}
                                                        onChange={(e) => updateFeature(feature.key, e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                                                        feature.warning
                                                            ? 'bg-white/20 peer-checked:bg-red-500'
                                                            : 'bg-white/20 peer-checked:bg-gold-500'
                                                    }`} />
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {formData.features.maintenance_mode && (
                                        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                            <div className="flex items-start gap-3">
                                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-red-400 font-medium">Maintenance Mode Active</p>
                                                    <p className="text-sm text-white/60 mt-1">
                                                        The site is currently in maintenance mode. Only administrators can access the site.
                                                        Regular users will see a maintenance page.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Social Links */}
                            {activeTab === 'social' && (
                                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
                                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                        <LinkIcon className="h-5 w-5 text-gold-400" />
                                        Social Media Links
                                    </h2>

                                    <div className="space-y-4">
                                        {[
                                            { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage', icon: '📘' },
                                            { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/yourhandle', icon: '🐦' },
                                            { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle', icon: '📷' },
                                            { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourcompany', icon: '💼' },
                                            { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/yourchannel', icon: '▶️' },
                                        ].map((social) => (
                                            <div key={social.key}>
                                                <label className="block text-sm font-medium text-white/90 mb-2">
                                                    <span className="mr-2">{social.icon}</span>
                                                    {social.label}
                                                </label>
                                                <input
                                                    type="url"
                                                    value={(formData.social as any)[social.key] || ''}
                                                    onChange={(e) => updateSocial(social.key, e.target.value)}
                                                    placeholder={social.placeholder}
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/30 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Email Configuration (Read-only) */}
                            {activeTab === 'email' && (
                                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
                                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                        <EnvelopeIcon className="h-5 w-5 text-gold-400" />
                                        Email Configuration
                                    </h2>

                                    <div className="mb-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <p className="text-blue-400 text-sm">
                                            Email settings are configured through environment variables (.env file) for security.
                                            The values shown below are read-only.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { key: 'mail_mailer', label: 'Mail Driver' },
                                            { key: 'mail_host', label: 'SMTP Host' },
                                            { key: 'mail_port', label: 'SMTP Port' },
                                            { key: 'mail_from_address', label: 'From Address' },
                                            { key: 'mail_from_name', label: 'From Name' },
                                        ].map((field) => (
                                            <div key={field.key}>
                                                <label className="block text-sm font-medium text-white/90 mb-2">{field.label}</label>
                                                <input
                                                    type="text"
                                                    value={(formData.email as any)[field.key] || '(not configured)'}
                                                    disabled
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/50 cursor-not-allowed"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Save Button (mobile) */}
                            {hasChanges && (
                                <div className="mt-6 lg:hidden">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 font-bold hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/25 disabled:opacity-50"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
