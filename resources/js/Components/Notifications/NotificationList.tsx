import { Link } from '@inertiajs/react';
import {
    CalendarDaysIcon,
    MegaphoneIcon,
    CreditCardIcon,
    BellIcon,
    CheckCircleIcon,
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

interface Props {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
}

export default function NotificationList({ notifications, onMarkAsRead }: Props) {
    const getIcon = (type: string) => {
        const iconClass = "w-5 h-5";
        switch (type) {
            case 'EventRegistrationNotification':
            case 'EventReminderNotification':
                return <CalendarDaysIcon className={iconClass} />;
            case 'AnnouncementNotification':
                return <MegaphoneIcon className={iconClass} />;
            case 'PaymentNotification':
            case 'EnrollmentConfirmedNotification':
                return <CreditCardIcon className={iconClass} />;
            default:
                return <BellIcon className={iconClass} />;
        }
    };

    const getIconBgColor = (type: string) => {
        switch (type) {
            case 'EventRegistrationNotification':
            case 'EventReminderNotification':
                return 'bg-blue-500/20 text-blue-400';
            case 'AnnouncementNotification':
                return 'bg-purple-500/20 text-purple-400';
            case 'PaymentNotification':
            case 'EnrollmentConfirmedNotification':
                return 'bg-green-500/20 text-green-400';
            default:
                return 'bg-gold-500/20 text-gold-400';
        }
    };

    const handleClick = (notification: Notification) => {
        if (!notification.read_at) {
            onMarkAsRead(notification.id);
        }
    };

    return (
        <div className="divide-y divide-white/5">
            {notifications.map((notification) => (
                <Link
                    key={notification.id}
                    href={notification.data.url || '/notifications'}
                    onClick={() => handleClick(notification)}
                    className={`block px-4 py-3 hover:bg-white/5 transition-colors ${
                        !notification.read_at ? 'bg-gold-500/5' : ''
                    }`}
                >
                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 p-2 rounded-full ${getIconBgColor(notification.type)}`}>
                            {getIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                                !notification.read_at ? 'text-white' : 'text-white/70'
                            }`}>
                                {notification.data.title || 'Notification'}
                            </p>
                            {notification.data.message && (
                                <p className="text-xs text-white/50 mt-0.5 line-clamp-2">
                                    {notification.data.message}
                                </p>
                            )}
                            <p className="text-xs text-white/30 mt-1">
                                {notification.created_at}
                            </p>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.read_at && (
                            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-gold-500"></div>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}
