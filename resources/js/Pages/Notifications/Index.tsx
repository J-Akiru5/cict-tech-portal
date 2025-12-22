import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassPageHeader from '@/Components/GlassPageHeader';
import {
    BellIcon,
    CalendarDaysIcon,
    MegaphoneIcon,
    CreditCardIcon,
    TrashIcon,
    CheckIcon,
} from '@heroicons/react/24/outline';

interface Notification {
    id: string;
    type: string;
    data: {
        title?: string;
        message?: string;
        url?: string;
        icon?: string;
    };
    read_at: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    notifications: {
        data: Notification[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    unreadCount: number;
}

export default function NotificationsIndex({ notifications, unreadCount }: Props) {
    const getIcon = (type: string) => {
        const iconClass = "w-6 h-6";
        switch (type) {
            case 'App\\Notifications\\EventRegistrationNotification':
            case 'App\\Notifications\\EventReminderNotification':
                return <CalendarDaysIcon className={iconClass} />;
            case 'App\\Notifications\\AnnouncementNotification':
                return <MegaphoneIcon className={iconClass} />;
            case 'App\\Notifications\\PaymentNotification':
                return <CreditCardIcon className={iconClass} />;
            default:
                return <BellIcon className={iconClass} />;
        }
    };

    const getIconBgColor = (type: string) => {
        if (type.includes('Event')) {
            return 'bg-blue-500/20 text-blue-400';
        } else if (type.includes('Announcement')) {
            return 'bg-purple-500/20 text-purple-400';
        } else if (type.includes('Payment') || type.includes('Enrollment')) {
            return 'bg-green-500/20 text-green-400';
        }
        return 'bg-gold-500/20 text-gold-400';
    };

    const markAsRead = async (id: string) => {
        await fetch(`/notifications/${id}/read`, { method: 'POST' });
        router.reload({ only: ['notifications', 'unreadCount'] });
    };

    const markAllAsRead = async () => {
        await fetch('/notifications/mark-all-read', { method: 'POST' });
        router.reload({ only: ['notifications', 'unreadCount'] });
    };

    const deleteNotification = async (id: string) => {
        await fetch(`/notifications/${id}`, { method: 'DELETE' });
        router.reload({ only: ['notifications', 'unreadCount'] });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Notifications" />

            <GlassPageHeader title="Notifications">
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gold-400 hover:text-gold-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <CheckIcon className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </GlassPageHeader>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Stats */}
                <div className="mb-6 flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                            <BellIcon className="w-5 h-5 text-gold-400" />
                            <span className="text-white/70 text-sm">
                                {notifications.total} total notifications
                            </span>
                        </div>
                        {unreadCount > 0 && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <span className="text-blue-400 text-sm font-medium">
                                    {unreadCount} unread
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                        {notifications.data.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {notifications.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 sm:p-6 hover:bg-white/5 transition-colors ${
                                            !notification.read_at ? 'bg-gold-500/5' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 p-3 rounded-full ${getIconBgColor(notification.type)}`}>
                                                {getIcon(notification.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className={`font-medium ${
                                                            !notification.read_at ? 'text-white' : 'text-white/70'
                                                        }`}>
                                                            {notification.data.title || 'Notification'}
                                                        </p>
                                                        {notification.data.message && (
                                                            <p className="text-sm text-white/50 mt-1">
                                                                {notification.data.message}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-white/30 mt-2">
                                                            {formatDate(notification.created_at)}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        {!notification.read_at && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="p-2 text-white/40 hover:text-gold-400 hover:bg-white/10 rounded-lg transition-colors"
                                                                title="Mark as read"
                                                            >
                                                                <CheckIcon className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteNotification(notification.id)}
                                                            className="p-2 text-white/40 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Link */}
                                                {notification.data.url && (
                                                    <Link
                                                        href={notification.data.url}
                                                        className="inline-flex items-center gap-1 mt-3 text-sm text-gold-400 hover:text-gold-300 transition-colors"
                                                    >
                                                        View details →
                                                    </Link>
                                                )}
                                            </div>

                                            {/* Unread Indicator */}
                                            {!notification.read_at && (
                                                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-gold-500"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-white/40">
                                <BellIcon className="w-16 h-16 mb-4 opacity-30" />
                                <p className="text-lg font-medium">No notifications yet</p>
                                <p className="text-sm mt-1">When you receive notifications, they'll appear here.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {notifications.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            {notifications.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                        link.active
                                            ? 'bg-gold-500 text-maroon-900 font-medium'
                                            : link.url
                                            ? 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                            : 'bg-white/5 text-white/30 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
